export default function ArticlePage({ params }: { params: { id: string } }) {
  return (
    <main className="p-8">
      <p>Article {params.id} — TODO (JOB-005)</p>
    </main>
  );
}
