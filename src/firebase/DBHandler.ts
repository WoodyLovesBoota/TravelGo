import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseDB } from "./firebase";
import { IUsers } from "../atoms";

const DBHandler = {
  async readPost(ref: string) {
    const snapshot = await getDocs(collection(firebaseDB, ref));
    return snapshot.docs.map((doc) => {
      return Object.assign(doc.data(), { id: doc.id });
    });
  },

  async writePost(ref: string, data: { nickname: string; content: string; userId: string }) {
    await setDoc(doc(collection(firebaseDB, ref)), {
      nickname: data.nickname,
      content: data.content,
      userId: data.userId,
      timestamp: serverTimestamp(),
      comments: [],
    });
  },

  async addUserInfoPost(ref: string, id: string, data: IUsers) {
    await setDoc(doc(collection(firebaseDB, ref), id), data, { merge: true });
  },

  async deletePost(id: string) {
    deleteDoc(doc(firebaseDB, `posts/${id}`));
  },
  async writeComment(id: string, data: { comment: string; userId: string }) {
    await updateDoc(doc(firebaseDB, `posts/${id}`), {
      comments: arrayUnion({ content: data.comment, userId: data.userId }),
    });
  },
  async deleteComment(id: string, data: { comment: string; userId: string }) {
    await updateDoc(doc(firebaseDB, `posts/${id}`), {
      comments: arrayRemove({ content: data.comment, userId: data.userId }),
    });
  },
};

export default DBHandler;
