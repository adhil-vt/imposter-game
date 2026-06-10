import { Peer, type DataConnection } from 'peerjs';

export interface NetworkPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isAdmin?: boolean;
  isMuted?: boolean;
}

export type NetworkMessage =
  | { type: 'JOIN'; name: string; avatar: string; playerId: string }
  | { type: 'LOBBY_UPDATE'; players: NetworkPlayer[] }
  | { type: 'START_GAME'; myPlayerId: string; players: any[]; playerOrder: string[]; commonWord: string; impostorWord: string; chosenCategory: string; activeWordPairHints: string[]; activePlayerVisualAid: any }
  | { type: 'REVEAL_COMPLETE'; playerId: string }
  | { type: 'REVEAL_PROGRESS'; revealedPlayers: string[] }
  | { type: 'TIMER_SYNC'; activeClueIndex: number; timerSeconds: number; timerActive: boolean }
  | { type: 'VOTE_CAST'; voterId: string; votedId: string }
  | { type: 'GAME_OVER'; winner: 'CREWMATES' | 'IMPOSTOR'; voteStats: Record<string, number>; votes: Record<string, string> }
  | { type: 'PLAY_AGAIN' }
  | { type: 'STATE_CHANGE'; state: string }
  | { type: 'KICKED' }
  | { type: 'CHAT'; message: any }
  | { type: 'ROOM_NOTICE'; text: string }
  | { type: 'ROOM_CLOSED' }
  | { type: 'SETTINGS_UPDATE'; difficulty: any; selectedCategories: any[]; impostorKnowsRole: boolean; randomizeOrder: boolean; hintsEnabled: boolean }
  | { type: 'TRANSFER_HOST'; newAdminId: string }
  | { type: 'KICK_REQUEST'; targetId: string }
  | { type: 'BAN_REQUEST'; targetId: string }
  | { type: 'START_GAME_REQUEST' }
  | { type: 'RESTART_GAME_REQUEST' }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string };

class MultiplayerService {
  private peer: Peer | null = null;
  private connections: Record<string, DataConnection> = {};
  private pendingMessages: Record<string, NetworkMessage[]> = {};
  private onMessageCallback: ((senderId: string, msg: NetworkMessage) => void) | null = null;
  private bannedIds: Set<string> = new Set();

  public isHost: boolean = false;
  public roomCode: string = '';
  public myPeerId: string = '';

  // Generate a random 5-digit numeric string for easy lobby entry
  private generateRoomCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  public initHost(
    onMessage: (senderId: string, msg: NetworkMessage) => void,
    onStatusChange: (status: 'connected' | 'disconnected' | 'error', detail?: string) => void,
    onPlayerJoined: (player: NetworkPlayer) => void,
    onPlayerDisconnected: (playerId: string) => void
  ): Promise<string> {
    this.isHost = true;
    this.connections = {};
    this.pendingMessages = {};
    this.onMessageCallback = onMessage;

    this.roomCode = this.generateRoomCode();

    return new Promise((resolve, reject) => {
      // Connect to the public PeerJS cloud server using our custom room code as the peer ID
      this.peer = new Peer(`imposter-${this.roomCode}`);

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        onStatusChange('connected');
        resolve(this.roomCode);
      });

      this.peer.on('connection', (conn) => {
        // Reject banned players immediately
        if (this.bannedIds.has(conn.peer)) {
          conn.on('open', () => {
            conn.send({ type: 'KICKED' });
            setTimeout(() => conn.close(), 500);
          });
          return;
        }

        // Handle incoming connection from a guest player
        conn.on('open', () => {
          this.connections[conn.peer] = conn;
          this.flushPendingMessages(conn.peer);
        });

        conn.on('data', (data: any) => {
          const msg = data as NetworkMessage;
          if (msg.type === 'JOIN') {
            onPlayerJoined({
              id: conn.peer,
              name: msg.name,
              avatar: msg.avatar,
            });
          } else {
            this.onMessageCallback?.(conn.peer, msg);
          }
        });

        conn.on('close', () => {
          delete this.connections[conn.peer];
          onPlayerDisconnected(conn.peer);
        });

        conn.on('error', (err) => {
          console.error('Connection error: ', err);
          delete this.connections[conn.peer];
          onPlayerDisconnected(conn.peer);
        });
      });

      this.peer.on('error', (err) => {
        console.error('Peer error: ', err);
        onStatusChange('error', err.message);
        reject(err);
      });
    });
  }

  public initGuest(
    roomCode: string,
    playerName: string,
    playerAvatar: string,
    onMessage: (senderId: string, msg: NetworkMessage) => void,
    onStatusChange: (status: 'connected' | 'disconnected' | 'error', detail?: string) => void
  ): Promise<void> {
    this.isHost = false;
    this.roomCode = roomCode;
    this.onMessageCallback = onMessage;

    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        
        // Connect to the host's peer ID
        const hostPeerId = `imposter-${roomCode}`;
        const conn = this.peer!.connect(hostPeerId);

        conn.on('open', () => {
          this.connections[hostPeerId] = conn;
          onStatusChange('connected');
          this.flushPendingMessages(hostPeerId);
          
          // Instantly send JOIN message to host
          conn.send({
            type: 'JOIN',
            name: playerName,
            avatar: playerAvatar,
            playerId: id,
          });
          resolve();
        });

        conn.on('data', (data: any) => {
          this.onMessageCallback?.(hostPeerId, data as NetworkMessage);
        });

        conn.on('close', () => {
          onStatusChange('disconnected');
        });

        conn.on('error', (err) => {
          onStatusChange('error', err.message);
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        onStatusChange('error', err.message);
        reject(err);
      });
    });
  }

  // Broadcast message to all connected peers (Host only) or send directly to Host (Guest only)
  public send(msg: NetworkMessage) {
    if (this.isHost) {
      Object.entries(this.connections).forEach(([peerId, conn]) => {
        if (conn.open) {
          conn.send(msg);
        } else if (msg.type === 'CHAT') {
          this.queuePendingMessage(peerId, msg);
        }
      });
    } else {
      const hostPeerId = `imposter-${this.roomCode}`;
      const conn = this.connections[hostPeerId];
      if (conn && conn.open) {
        conn.send(msg);
      } else if (msg.type === 'CHAT') {
        this.queuePendingMessage(hostPeerId, msg);
      }
    }
  }

  // Send a targeted message to a single player connection (Host only)
  public sendTo(playerId: string, msg: NetworkMessage) {
    if (this.isHost) {
      const conn = this.connections[playerId];
      if (conn && conn.open) {
        conn.send(msg);
      }
    }
  }

  public kickPlayer(playerId: string) {
    if (this.isHost) {
      const conn = this.connections[playerId];
      if (conn) {
        if (conn.open) {
          conn.send({ type: 'KICKED' });
        }
        conn.close();
        delete this.connections[playerId];
      }
    }
  }

  public banPlayer(playerId: string) {
    if (this.isHost) {
      this.bannedIds.add(playerId);
      this.kickPlayer(playerId);
    }
  }

  // Host only: tell every connected guest the room is closing, then tear down.
  // Guests detect this both via the explicit ROOM_CLOSED message (fast path) and
  // via the connection 'close' event fired when the peer is destroyed (fallback).
  public closeRoom() {
    if (!this.isHost) {
      this.disconnect();
      return;
    }
    Object.values(this.connections).forEach((conn) => {
      if (conn.open) {
        try {
          conn.send({ type: 'ROOM_CLOSED' });
        } catch {
          // ignore send failures on a closing connection
        }
      }
    });
    // Give the ROOM_CLOSED messages a moment to flush before destroying the peer.
    setTimeout(() => this.disconnect(), 200);
  }

  public disconnect() {
    Object.values(this.connections).forEach((conn) => conn.close());
    this.connections = {};
    this.pendingMessages = {};
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.bannedIds.clear();
    this.isHost = false;
    this.roomCode = '';
    this.myPeerId = '';
  }

  private queuePendingMessage(targetId: string, msg: NetworkMessage) {
    if (!this.pendingMessages[targetId]) {
      this.pendingMessages[targetId] = [];
    }
    const bucket = this.pendingMessages[targetId];
    if (msg.type === 'CHAT' && bucket.some(existing => existing.type === 'CHAT' && (existing as any).message?.id === (msg as any).message?.id)) {
      return;
    }
    bucket.push(msg);
  }

  private flushPendingMessages(targetId: string) {
    const queued = this.pendingMessages[targetId];
    const conn = this.connections[targetId];
    if (!queued || !conn || !conn.open) return;

    queued.forEach((msg) => conn.send(msg));
    delete this.pendingMessages[targetId];
  }
}

export const multiplayer = new MultiplayerService();
