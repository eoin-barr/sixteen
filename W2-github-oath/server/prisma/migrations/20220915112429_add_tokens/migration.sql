-- CreateTable
CREATE TABLE "user_token" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hash" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL DEFAULT (now() + '10 years'::interval),

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "github_id" BIGINT NOT NULL,
    "github_username" TEXT NOT NULL,
    "github_avatar_url" TEXT NOT NULL,
    "date_joined" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "github_app_installed" BOOLEAN NOT NULL DEFAULT false,
    "github_oauth_token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "tite" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_token_hash_key" ON "user_token"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
