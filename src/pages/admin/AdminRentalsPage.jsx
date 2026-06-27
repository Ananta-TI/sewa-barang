import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency, formatDate } from "../../utils/format";
export default function AdminRentalsPage() {
  const { db } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="Monitoring transaksi"
        title="Semua Penyewaan"
        description="Pantau status pemesanan, pembayaran, pengambilan, dan pengembalian seluruh transaksi."
      />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Barang</th>
                <th>Pemilik</th>
                <th>Penyewa</th>
                <th>Periode</th>
                <th>Total</th>
                <th>Status</th>
                <th>Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {db.rentals.map((r) => {
                const item = db.items.find((i) => i.id === r.item_id);
                const owner = db.users.find((u) => u.id === item?.owner_id);
                const renter = db.users.find((u) => u.id === r.renter_id);
                return (
                  <tr key={r.id}>
                    <td>SW-{r.id}</td>
                    <td>{item?.name}</td>
                    <td>{owner?.name}</td>
                    <td>{renter?.name}</td>
                    <td>
                      {formatDate(r.start_date)}
                      <br />
                      <small>s.d. {formatDate(r.end_date)}</small>
                    </td>
                    <td>{formatCurrency(r.total)}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td>
                      <StatusBadge status={r.payment_status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
