<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('endpoint_logs', function (Blueprint $table) {
            $table->id();
            $table->string('method', 10);
            $table->text('endpoint');
            $table->string('path');
            $table->unsignedSmallInteger('status_code');
            $table->boolean('is_success');
            $table->string('ip_address', 45)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('user_agent')->nullable();
            $table->decimal('duration_ms', 10, 2);
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['created_at']);
            $table->index(['status_code']);
            $table->index(['is_success']);
            $table->index(['user_id']);
            $table->index(['path']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('endpoint_logs');
    }
};
