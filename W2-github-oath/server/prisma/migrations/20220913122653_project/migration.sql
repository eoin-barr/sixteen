-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "tite" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
