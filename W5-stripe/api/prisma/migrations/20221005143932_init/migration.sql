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
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "github_id" BIGINT NOT NULL,
    "github_username" TEXT NOT NULL,
    "github_avatar_url" TEXT NOT NULL,
    "date_joined" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "github_app_installed" BOOLEAN NOT NULL DEFAULT false,
    "github_oauth_token" TEXT,
    "customer_id" TEXT,
    "pricing_plan" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_plans" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "cheapest_price" SMALLINT NOT NULL DEFAULT 0,
    "expensive_price" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_token_hash_key" ON "user_token"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_plans_name_key" ON "pricing_plans"("name");

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pricing_plan_fkey" FOREIGN KEY ("pricing_plan") REFERENCES "pricing_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
