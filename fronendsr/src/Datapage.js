export default function Datapage(props) {
  const generateRows = () => {
    if (props.data != null) {
      return props.data.map((datapage) => (
        <tr key={datapage.id}>
          <td>{datapage.attributes.name}</td>
          <td>{datapage.attributes.datetime}</td>
        </tr>
      ));
    } else {
      return null;
    }
  };
  return (
    <table border="1">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>{generateRows()}</tbody>
    </table>
  );
}
