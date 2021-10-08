const Submenu = ({component ,links}) => {

    links = links.sort((a, b) => {
        if (a.props.children < b.props.children) return -1;
        if (a.props.children > b.props.children) return 1;
        return 0;
    })

    return ( 
        <div className="content-split">
            <div className="submenu box">
                <h2>Navigation</h2>
                <ul>
                    {links.map((x, index) => (
                        <li key={index} >{x}</li>
                    ))}
                </ul>
            </div>

        {component}
      </div> 
      );
}
 
export default Submenu;

