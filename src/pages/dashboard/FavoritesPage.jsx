import EmptyState from '../../components/EmptyState'
import ItemCard from '../../components/ItemCard'
import PageHeader from '../../components/PageHeader'
import { useDemo } from '../../contexts/DemoContext'
export default function FavoritesPage(){const {db,currentUser}=useDemo();const ids=db.favorites.filter(f=>f.user_id===currentUser.id).map(f=>f.item_id);const items=db.items.filter(i=>ids.includes(i.id));return <><PageHeader eyebrow="Daftar tersimpan" title="Barang Favorit" description="Simpan barang menarik agar mudah ditemukan kembali."/>{items.length?<div className="items-grid">{items.map(i=><ItemCard key={i.id} item={i}/>)}</div>:<EmptyState title="Belum ada favorit" description="Tekan ikon hati pada barang yang ingin kamu simpan."/>}</>}
