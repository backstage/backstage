import{j as e,r as c}from"./iframe-B1bS8kNu.js";import{M as a,e as s,b as r,a as M,S as g}from"./Menu-N2ul5Hsv.js";import{M as x}from"./index-BB5XVHud.js";import{B as i}from"./Button-BrJj6XYZ.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-CvFEU40R.js";import"./utils-Ct9nIYhz.js";import"./clsx-B-dksMZM.js";import"./useFocusRing-BWaXYjK-.js";import"./useLabels-DeqL7pR1.js";import"./useListState-B5ZvYJQm.js";import"./usePress-PLs-ahDg.js";import"./SelectionIndicator-By2VZM5T.js";import"./context-gapuUxpK.js";import"./Hidden-C8ZNz1al.js";import"./useControlledState-BKEhICv4.js";import"./useLocalizedStringFormatter-Bnqr3tNG.js";import"./Button-CRYlP5od.js";import"./Dialog-xGOH9rrL.js";import"./OverlayArrow-B01sdzta.js";import"./ListBox-Crnk6ksH.js";import"./Text-Budx4BIw.js";import"./VisuallyHidden-BydX4xaq.js";import"./Input-Czp_YjeK.js";import"./useFormReset-DikDZp7U.js";import"./Form-CN0RQwQD.js";import"./SearchField-CPKh7Wvl.js";import"./FieldError-BWq8aMa1.js";import"./Label-CFMBPk1Y.js";import"./useStyles-CdqC6JSo.js";import"./index-CYRNriET.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BHYJStbY.js";const Z={title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(x,{children:e.jsx(t,{})})]},j=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(s,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})},u={args:{...o.args},render:()=>e.jsxs(a,{children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(s,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})},l={args:{...o.args},render:()=>{const[t,d]=c.useState([]);return c.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{d(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsx(s,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,h)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},h))})]})}},m={args:{...o.args},render:()=>{const[t,d]=c.useState([]);return c.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{d(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsx(s,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,h)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},h))})]})}},p={args:{...o.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(M,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(g,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(s,{placement:"right top",children:j.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete placeholder="Filter">
        <MenuItem>Create new file...</MenuItem>
        <MenuItem>Create new folder...</MenuItem>
        <MenuItem>Assign to...</MenuItem>
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Change status...</MenuItem>
        <MenuItem>Change priority...</MenuItem>
        <MenuItem>Add label...</MenuItem>
        <MenuItem>Remove label...</MenuItem>
      </MenuAutocomplete>
    </MenuTrigger>
}`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete placeholder="Filter">
        <MenuItem>Create new file...</MenuItem>
        <MenuItem>Create new folder...</MenuItem>
        <MenuItem>Assign to...</MenuItem>
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Change status...</MenuItem>
        <MenuItem>Change priority...</MenuItem>
        <MenuItem>Add label...</MenuItem>
        <MenuItem>Remove label...</MenuItem>
      </MenuAutocomplete>
    </MenuTrigger>
}`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => {
    const [pokemon, setPokemon] = useState<Array<{
      name: string;
      url: string;
    }>>([]);
    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then(response => response.json()).then(data => {
        setPokemon(data.results);
      }).catch(error => {
        console.error('Error fetching Pokemon:', error);
      });
    }, []);
    return <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuAutocomplete items={pokemon} placeholder="Search Pokemon..." virtualized>
          {pokemon.map((p, index) => <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>)}
        </MenuAutocomplete>
      </MenuTrigger>;
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => {
    const [pokemon, setPokemon] = useState<Array<{
      name: string;
      url: string;
    }>>([]);
    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then(response => response.json()).then(data => {
        setPokemon(data.results);
      }).catch(error => {
        console.error('Error fetching Pokemon:', error);
      });
    }, []);
    return <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuAutocomplete items={pokemon} placeholder="Search Pokemon..." virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>)}
        </MenuAutocomplete>
      </MenuTrigger>;
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Submenu</MenuItem>
          <MenuAutocomplete placement="right top">
            {options.map(option => <MenuItem key={option.value} id={option.value}>
                {option.label}
              </MenuItem>)}
          </MenuAutocomplete>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
}`,...p.parameters?.docs?.source}}};const $=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,u as PreviewAutocompleteMenu,p as Submenu,l as Virtualized,m as VirtualizedMaxHeight,$ as __namedExportsOrder,Z as default};
