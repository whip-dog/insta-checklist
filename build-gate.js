// index.src.html（プレーンなアプリ本体）を合言葉で暗号化し、
// パスワードゲート付きの公開用 index.html を生成する。
//
// 使い方:  node build-gate.js "合言葉"
//
// - 中身はAES-256-GCMで暗号化され、合言葉なしでは解読不可（ソースを覗いても見えない）
// - 生成された index.html だけを公開repoにcommit/pushする
// - index.src.html（プレーン）は .gitignore で公開しない
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const password = process.argv[2];
if (!password) { console.error('使い方: node build-gate.js "合言葉"'); process.exit(1); }

const src = fs.readFileSync(path.join(__dirname, 'index.src.html'), 'utf8');

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, 200000, 32, 'sha256');
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(src, 'utf8'), cipher.final()]);
const ct = Buffer.concat([enc, cipher.getAuthTag()]); // Web Crypto互換(末尾16byteが認証タグ)

const DATA = { salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') };

const gate = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>インスタ運用チェックリスト</title>
<style>
 *{margin:0;padding:0;box-sizing:border-box}
 body{font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;min-height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#f09433,#dc2743,#bc1888);padding:24px}
 .box{background:#fff;border-radius:20px;padding:34px 24px;max-width:360px;width:100%;text-align:center;box-shadow:0 12px 44px rgba(0,0,0,.22)}
 .lock{font-size:2rem;margin-bottom:8px}
 h1{font-size:1.12rem;margin-bottom:8px}
 .sub{font-size:.8rem;color:#777;line-height:1.7;margin-bottom:20px}
 input{width:100%;padding:13px 14px;font-size:1rem;border:2px solid #eadfd9;border-radius:12px;text-align:center;margin-bottom:12px;font-family:inherit}
 input:focus{outline:none;border-color:#dc2743}
 button{width:100%;padding:13px;font-size:1rem;font-weight:700;color:#fff;border:none;border-radius:12px;background:linear-gradient(45deg,#dc2743,#bc1888);cursor:pointer}
 .err{color:#dc2743;font-size:.82rem;min-height:1.3em;margin-top:10px}
 .hint{color:#9a9a9a;font-size:.72rem;margin-top:16px;line-height:1.7}
</style>
</head>
<body>
<div class="box">
 <div class="lock">🔒</div>
 <h1>📸 インスタ運用チェックリスト</h1>
 <p class="sub">リベシティ会員限定ページです。<br>合言葉を入力してください。</p>
 <input id="pw" type="password" placeholder="合言葉" autocomplete="off" autofocus>
 <button id="go">開く</button>
 <p class="err" id="err"></p>
 <p class="hint">合言葉はリベシティの投稿に書いてあります</p>
</div>
<script>
const DATA=${JSON.stringify(DATA)};
const b=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function unlock(pw){
 try{
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b(DATA.salt),iterations:200000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['decrypt']);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b(DATA.iv)},key,b(DATA.ct));
  const html=new TextDecoder().decode(pt);
  try{localStorage.setItem('insta-gate-pw',pw)}catch(e){}
  document.open();document.write(html);document.close();
  return true;
 }catch(e){return false}
}
document.getElementById('go').onclick=async function(){
 const ok=await unlock(document.getElementById('pw').value.trim());
 if(!ok)document.getElementById('err').textContent='合言葉が違います';
};
document.getElementById('pw').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('go').click()});
// 一度入力したら次回から自動で開く（各自の端末に記憶）
(function(){try{const s=localStorage.getItem('insta-gate-pw');if(s)unlock(s)}catch(e){}})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), gate);
console.log('✅ index.html を暗号化ゲート付きで生成しました（合言葉:「' + password + '」）');
