const request = require("supertest");
const { Note } = require("../../models/Note");
const { User } = require("../../models/User");
const mongoose = require("mongoose");

let server;
const userName1 = "TestUser1";
let userId1;
const userName2 = "TestUser2";
let userId2;
const password = "Abc1234";
let testTitle = "Test Title";
let testNotes = "Test notes";

describe("/api/notes", () => {
  beforeEach(async () => {
    server = require("../../server");
    userId1 = mongoose.Types.ObjectId();
    userId2 = mongoose.Types.ObjectId();
    testUser1 = new User({ _id: userId1, userName: userName1, password });
    testUser2 = new User({ _id: userId2, userName: userName2, password });
    token1 = testUser1.generateAuthToken();
    token2 = testUser2.generateAuthToken();

    await User.collection.insertMany([testUser1, testUser2]);
  });
  afterEach(async () => {
    await Note.remove({});
    await User.remove({});
    await server.close();
  });

  describe("GET /:username/", () => {
    //Error path
    it("should return unauthorized error without token", async () => {
      const res = await request(server).get(`/api/notes/${userName1}`);
      expect(res.status).toBe(401);
    });

    it("should return unauthorized if user trying to get notes not belonging to the user", async () => {
      const res = await request(server)
        .get(`/api/notes/${userName1}`)
        .set("Authorization", `Bearer ${token2}`);
      expect(res.status).toBe(401);
    });
    //Happy path
    it("should return all notes relating specific user", async () => {
      const notes = [
        { userId: userId1, title: "user1 note1", note: "test note 1" },
        { userId: userId1, title: "user1 note2", note: "test note 2" },
        { userId: userId2, title: "user2 note", note: "test note 3" }
      ];

      await Note.collection.insertMany(notes);

      const res = await request(server)
        .get(`/api/notes/${userName1}`)
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.title === notes[0].title)).toBeTruthy();
      expect(res.body.some(g => g.title === notes[1].title)).toBeTruthy();
    });
  });

  describe("POST /", () => {
    const postData = async () => {
      return await request(server)
        .post("/api/notes/")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          title: testTitle,
          note: testNotes,
          userId: userId1
        });
    };

    beforeEach(async () => {
      testTitle = "Test Title";
      testNotes = "Test Notes";
    });

    //Error path
    it("should return unauthorized error without token", async () => {
      token1 = "";
      const res = await postData();
      expect(res.status).toBe(401);
    });

    it("should return bad requrest when title is missing", async () => {
      testTitle = "";
      const res = await postData();

      expect(res.status).toBe(400);
    });

    it("should return bad requrest when notes is missing", async () => {
      testNotes = "";
      const res = await postData();

      expect(res.status).toBe(400);
    });

    //Happy path
    it("should add notes if the request is valid", async () => {
      const res = await postData();

      expect(res.status).toBe(200);
      const newNote = await Note.find({ title: testTitle });
      expect(newNote).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    let updatingNoteId;
    let updateTitle;
    let updateNote;
    const putRequest = async () => {
      return await request(server)
        .put(`/api/notes/${updatingNoteId}`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          title: updateTitle,
          note: updateNote,
          userId: userId1
        });
    };

    beforeEach(async () => {
      note = new Note({ title: testTitle, notes: testNotes, userId: userId1 });
      await note.save();
      updatingNoteId = note._id;

      updateTitle = "Update Title";
      updateNote = "Update Notes";
    });

    //Error path
    it("should return unauthorized error without token", async () => {
      token1 = "";
      const res = await putRequest();
      expect(res.status).toBe(401);
    });

    it("should return unauthorized if different user try to update", async () => {
      token1 = token2;
      const res = await putRequest();
      expect(res.status).toBe(401);
    });

    it("should return bad requrest when title is missing", async () => {
      updateTitle = "";
      const res = await putRequest();

      expect(res.status).toBe(400);
    });

    it("should return bad requrest when notes is missing", async () => {
      updateNote = "";
      const res = await putRequest();

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /:id', () => {
    let newNoteId;
    const deleteRequest = async () => {
      return await request(server)
        .delete(`/api/notes/${newNoteId}`)
        .set("Authorization", `Bearer ${token1}`);
    };

    beforeEach(async () => {
      note = new Note({ title: 'Delete Test', notes: 'Delete test', userId: userId1 });
      await note.save();
      newNoteId = note._id;
    });

    //Error path
    it("should return unauthorized error without token", async () => {
      token1 = "";
      const res = await deleteRequest();
      expect(res.status).toBe(401);
    });

    it("should return unauthorized if different user try to delete", async () => {
      token1 = token2;
      const res = await deleteRequest();
      expect(res.status).toBe(401);
    });

    it("should return bad requrest when the note was not found", async () => {
      newNoteId = mongoose.Types.ObjectId();
      const res = await deleteRequest();

      expect(res.status).toBe(404);
    });

    //Happy path
    it('should delete the note if input is valid', async () => {
      await deleteRequest();

      const noteInDb = await Note.findById(newNoteId);

      expect(noteInDb).toBeNull();
    });

    it('should return the removed note', async () => {
      const res = await deleteRequest();

      expect(res.body).toHaveProperty('_id', newNoteId.toHexString());
      expect(res.body).toHaveProperty('title', 'Delete Test');
    });

  });
});
