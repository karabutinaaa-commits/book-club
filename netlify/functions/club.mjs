import { getStore } from '@netlify/blobs';
const members = (process.env.CLUB_MEMBERS || 'Alena,Member 2,Member 3,Member 4').split(',').map(s=>s.trim()).filter(Boolean);
const secret = process.env.CLUB_PASSWORD;
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const clean=s=>String(s||'').trim().slice(0,300);
export default async (request)=>{
 if(!secret) return json({error:'Set CLUB_PASSWORD in Netlify environment variables.'},503);
 if(request.headers.get('x-club-password')!==secret) return json({error:'Incorrect club password.'},401);
 const store=getStore('book-club');
 let state=await store.get('state',{type:'json'})||{books:[]};
 if(request.method==='GET') return json({books:state.books,members});
 if(request.method!=='POST') return json({error:'Method not allowed'},405);
 let data;try{data=await request.json()}catch{return json({error:'Invalid request'},400)}
 const actor=clean(data.actor);if(!members.includes(actor))return json({error:'Choose a club member.'},400);
 const id=clean(data.id);let book=state.books.find(b=>b.id===id);
 if(data.action==='add'){
  const title=clean(data.title),author=clean(data.author);
  if(!title||!author)return json({error:'Title and author are required.'},400);
  if(state.books.some(b=>b.title.toLowerCase()===title.toLowerCase()&&b.author.toLowerCase()===author.toLowerCase()))return json({error:'This book is already nominated.'},409);
  state.books.push({id:crypto.randomUUID(),title,author,cover:clean(data.cover).slice(0,500),genre:clean(data.genre),note:clean(data.note),nominatedBy:actor,status:'nominated',votes:{},createdAt:new Date().toISOString()});
 }else if(data.action==='vote'){
  if(!book||book.status!=='nominated')return json({error:'Book unavailable for voting.'},404);
  if(!Number.isInteger(data.score)||data.score< -2||data.score>2)return json({error:'Invalid vote.'},400);
  book.votes[actor]=data.score;
 }else if(data.action==='status'){
  if(!book)return json({error:'Book not found.'},404);
  if(!['nominated','reading','finished'].includes(data.status))return json({error:'Invalid status.'},400);
  if(data.meeting!==undefined){
   const date=clean(data.meeting?.date),time=clean(data.meeting?.time),location=clean(data.meeting?.location);
   if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))return json({error:'Invalid meeting date.'},400);
   if(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return json({error:'Invalid meeting time.'},400);
   book.meeting={date,time,location};
  }
  book.status=data.status;
 }else if(data.action==='delete'){
  if(!book)return json({error:'Book not found.'},404);
  state.books=state.books.filter(b=>b.id!==id);
 }else return json({error:'Unknown action.'},400);
 await store.setJSON('state',state);return json({books:state.books,members});
};
