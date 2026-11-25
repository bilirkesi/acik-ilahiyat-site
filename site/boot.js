/* Tema ve okuma ayarlarını ilk boyamadan önce uygular.
 *
 * index.html bu dosyayı <head> içinde, defer'sız yükler; böylece koyu tema ve
 * yazı boyutu sayfa görünmeden önce yerleşir. Satır içi <script> yerine ayrı
 * dosya olmasının nedeni CSP: index.html yalnızca 'self' kaynaklı betiklere
 * izin verir, satır içi betik çalıştırmaz.
 */
try {
  var d = document.documentElement, t = localStorage.getItem("pu.theme");
  if (t) d.dataset.theme = t;
  var r = JSON.parse(localStorage.getItem("pu.read") || "{}");
  if (r.fs) d.style.fontSize = r.fs + "%";
  if (r.lh) d.dataset.lh = r.lh;
  if (r.ff) d.dataset.ff = r.ff;
} catch (e) {}
