function Trash() {
  return (
    <>
      <div
        style={{
          fontSize: '40px',
          fontWeight: 'bold',
          background: 'white',
          userSelect: 'none'
        }}
      >
        {/* TODO: Replace Unicode with an actual icon */}
        🗑
      </div>
    </>
  );
}

export default Trash;
