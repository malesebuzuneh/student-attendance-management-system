<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin account
        // Admin accounts should only be created by developers via seeder
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Melese Buzuneh',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
            ]
        );

        echo "Admin account created:\n";
        echo "Name: Melese Buzuneh\n";
        echo "Email: admin@gmail.com\n";
        echo "Password: admin123\n";
        echo "✅ Admin account ready to use!\n\n";
    }
}
