export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 初始化数据库表
    if (url.pathname === '/init') {
      await env.DB.exec(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        type TEXT DEFAULT '日记',
        created_at TEXT DEFAULT (datetime('now','+8 hours'))
      )`);
      return new Response('数据库已初始化 ✅');
    }

    // 写入
    if (url.pathname === '/write' && request.method === 'POST') {
      const { content, type } = await request.json();
      await env.DB.prepare('INSERT INTO notes (content, type) VALUES (?, ?)').bind(content, type || '日记').run();
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 读取
    if (url.pathname === '/read') {
      const { results } = await env.DB.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 首页
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>婷婷的小窝</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#eee;font-family:Arial;padding:20px;max-width:500px;margin:auto}
h1{color:#e94560;text-align:center;margin-bottom:15px}
textarea{width:100%;padding:12px;border-radius:8px;border:1px solid #333;background:#16213e;color:#eee;font-size:.9rem;min-height:80px;font-family:Arial}
.btns{display:flex;gap:8px;margin:10px 0}
.btn{flex:1;padding:10px;border:none;border-radius:8px;font-size:.85rem;cursor:pointer;color:#fff}
.btn.diary{background:#e94560}
.btn.letter{background:#6c5ce7}
.btn.log{background:#4ecca3;color:#333}
.entries{margin-top:15px}
.entry{background:#16213e;border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid #e94560}
.entry .type{font-size:.65rem;color:#888}
.entry .time{font-size:.65rem;color:#555;float:right}
.entry .text{font-size:.85rem;color:#ddd;line-height:1.5;margin-top:2px}
.loading{text-align:center;color:#888;padding:20px}
</style></head><body>
<h1>🌸 婷婷的小窝</h1>
<textarea id="input" placeholder="写点什么……"></textarea>
<div class="btns">
<button class="btn diary" onclick="writeEntry('日记')">📝 日记</button>
<button class="btn letter" onclick="writeEntry('信件')">💌 信件</button>
<button class="btn log" onclick="writeEntry('日志')">📋 日志</button>
</div>
<div class="entries" id="entries"><div class="loading">加载中…</div></div>
<script>
async function load(){
  const r=await fetch('/read');
  const d=await r.json();
  document.getElementById('entries').innerHTML=d.length?
    d.map(e=>'<div class=entry><span class=type>'+e.type+'</span><span class=time>'+e.created_at.slice(5,16)+'</span><div class=text>'+e.content+'</div></div>').join('')
    :'<div style=color:#888;text-align:center;padding:20px>还没有内容</div>';
}
async function writeEntry(t){
  const c=document.getElementById('input').value.trim();
  if(!c)return;
  await fetch('/write',{method:'POST',body:JSON.stringify({content:c,type:t})});
  document.getElementById('input').value='';
  load();
}
load();
</script></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  }
};
