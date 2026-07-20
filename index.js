export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>婷婷的小窝</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#eee;font-family:Arial;padding:20px;max-width:500px;margin:auto}
h1{color:#e94560;text-align:center}
textarea{width:100%;padding:12px;border-radius:8px;border:1px solid #333;background:#16213e;color:#eee;font-size:.9rem;min-height:80px}
.btns{display:flex;gap:8px;margin:10px 0}
.btn{flex:1;padding:10px;border:none;border-radius:8px;font-size:.85rem;cursor:pointer;color:#fff}
.btn.diary{background:#e94560}
.btn.letter{background:#6c5ce7}
.btn.log{background:#4ecca3;color:#333}
.entries{margin-top:15px}
.entry{background:#16213e;border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid #e94560}
.entry .type{font-size:.7rem;color:#888}
.entry .time{font-size:.7rem;color:#555;float:right}
.entry .text{font-size:.85rem;color:#ddd;line-height:1.5}
</style></head><body>
<h1>🌸 婷婷的小窝</h1>
<textarea id="input" placeholder="写点什么……"></textarea>
<div class="btns">
<button class="btn diary" onclick="save('📝 日记')">日记</button>
<button class="btn letter" onclick="save('💌 信件')">信件</button>
<button class="btn log" onclick="save('📋 日志')">日志</button>
</div>
<div class="entries" id="list"></div>
<script>
function load(){
  const data=JSON.parse(localStorage.getItem('notes')||'[]');
  document.getElementById('list').innerHTML=data.length?
    data.map(e=>'<div class=entry><span class=type>'+e.t+'</span><span class=time>'+e.d+'</span><div class=text>'+e.c+'</div></div>').join('')
    :'<div style=color:#888;text-align:center;padding:20px>还没有内容</div>';
}
function save(t){
  const c=document.getElementById('input').value.trim();
  if(!c)return;
  const data=JSON.parse(localStorage.getItem('notes')||'[]');
  data.unshift({t,c,d:new Date().toLocaleString()});
  localStorage.setItem('notes',JSON.stringify(data));
  document.getElementById('input').value='';
  load();
}
load();
</script></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  }
};
