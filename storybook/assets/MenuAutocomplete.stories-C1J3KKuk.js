import{j as e,r as c}from"./iframe-CIM5duhm.js";import{M as a,e as s,b as r,a as M,S as g}from"./Menu-DBTY_gDH.js";import{M as x}from"./index-eXSQF74E.js";import{B as i}from"./Button-BM0OCYSZ.js";import"./preload-helper-D9Z9MdNV.js";import"./Dialog-BQi5l6Ha.js";import"./ListBox-BW0EfVwq.js";import"./useListState-C6f2wNSN.js";import"./useFocusRing-Cr9lwsBD.js";import"./utils-CRJoEm3K.js";import"./clsx-B-dksMZM.js";import"./usePress-vyUcztdy.js";import"./useEvent-Cy_FdvQx.js";import"./SelectionIndicator-Dw0U_Bvy.js";import"./context-B7jRTLWP.js";import"./Hidden-9k8g-7t3.js";import"./useControlledState-BMMPavn8.js";import"./RSPContexts-CqtEgdGk.js";import"./Text-bqh5tAbH.js";import"./useLabel-WEp9ptwG.js";import"./useLabels-BKn1V8s6.js";import"./useLocalizedStringFormatter-CL7dMIzM.js";import"./Button-RCrhIqcs.js";import"./Label-ByZMsSG7.js";import"./OverlayArrow-CJB_l1XW.js";import"./VisuallyHidden-s33Jk0Sn.js";import"./Input-D7tySBxg.js";import"./useFormReset-Bfmh-uiu.js";import"./Form-CdGZ-Si5.js";import"./SearchField-BLszLpMX.js";import"./FieldError-K8CUeE9R.js";import"./useStyles-hnadVxcR.js";import"./index-CoK9Idjr.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BPzqtDAO.js";const ee={title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(x,{children:e.jsx(t,{})})]},j=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(s,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})},u={args:{...o.args},render:()=>e.jsxs(a,{children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(s,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})},l={args:{...o.args},render:()=>{const[t,d]=c.useState([]);return c.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{d(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsx(s,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,h)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},h))})]})}},m={args:{...o.args},render:()=>{const[t,d]=c.useState([]);return c.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{d(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsx(s,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,h)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},h))})]})}},p={args:{...o.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(M,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(g,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(s,{placement:"right top",children:j.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const re=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,u as PreviewAutocompleteMenu,p as Submenu,l as Virtualized,m as VirtualizedMaxHeight,re as __namedExportsOrder,ee as default};
