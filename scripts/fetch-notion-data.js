import { Client } from '@notionhq/client';
import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

// .envファイルから環境変数を読み込む
dotenv.config();
console.log('--- デバッグ情報 ---');
console.log('読み込まれたNOTION_TOKEN:', process.env.NOTION_TOKEN ? `「${process.env.NOTION_TOKEN.substring(0, 10)}...」(最初の10文字)` : '【未定義】');
console.log('読み込まれたNOTION_DATABASE_ID:', process.env.NOTION_DATABASE_ID || '【未定義】');
console.log('--------------------');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// サムネイル画像を保存するディレクトリ
const THUMBNAIL_DIR = '../public/thumbnails';

// ディレクトリがなければ作成
if (!fs.existsSync(THUMBNAIL_DIR)){
    fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

async function getNotionData() {
    console.log('Notionからデータを取得しています...');

    const response = await notion.databases.query({
        database_id: DATABASE_ID,
        // 必要に応じてフィルターやソートを追加
        // sorts: [{ property: '公開日', direction: 'descending' }]
    });

    // ここに画像ダウンロード処理を追加していきます（Step 3）
    const posts = response.results.map(page => {
        // デバッグ用に一旦カバー画像のURLを取得
        const coverUrl = page.cover?.file?.url || page.cover?.external?.url || null;
        console.log(`[${page.id}] カバー画像URL: ${coverUrl}`);

        return {
            id: page.id,
            title: page.properties.Name.title[0]?.plain_text || '無題',
            notionUrl: page.url,
        };
    });

    console.log('データ取得が完了しました。');
    return posts;
}

getNotionData();