import{j as e,r as c}from"./iframe-omS-VfEE.js";import{M as a,e as s,b as r,a as M,S as g}from"./Menu-r6vdaXOH.js";import{M as x}from"./index-BJYML3pb.js";import{B as i}from"./Button-HW0r4rXW.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-G7d0EChZ.js";import"./ListBox-DyoYEtN0.js";import"./useListState-hxCAMdTS.js";import"./useFocusable-ehJVjgGZ.js";import"./useObjectRef-B0RPejrJ.js";import"./clsx-B-dksMZM.js";import"./usePress-72wuheOL.js";import"./useEvent-P1WjGuzH.js";import"./SelectionIndicator-CJv5Tdlo.js";import"./context-2d53qf4y.js";import"./Hidden-DHOKYpmz.js";import"./useControlledState-DJphQVnd.js";import"./utils-DLXcovlG.js";import"./RSPContexts-BCZNT60J.js";import"./Text-DXRpKqp0.js";import"./useLabel-BNIsNjqB.js";import"./useLabels-B2lHZLOH.js";import"./useFocusRing-BHig4UXG.js";import"./useLocalizedStringFormatter-BpvxSAUE.js";import"./Button-Cho07eiH.js";import"./Label-DLUiCF30.js";import"./OverlayArrow-D-ILRaiP.js";import"./VisuallyHidden-BELJ4y_8.js";import"./Input-DEqK4bQx.js";import"./useFormReset-BglsYpuv.js";import"./Form-BlX5J7Yp.js";import"./SearchField-BjbX7O60.js";import"./FieldError-CUOAcPZ5.js";import"./useStyles-C35pT2tV.js";import"./index-bsphKHom.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BPzqtDAO.js";const ne={title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(x,{children:e.jsx(t,{})})]},j=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(s,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})},u={args:{...o.args},render:()=>e.jsxs(a,{children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(s,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})},l={args:{...o.args},render:()=>{const[t,d]=c.useState([]);return c.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{d(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsx(s,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,h)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},h))})]})}},m={args:{...o.args},render:()=>{const[t,d]=c.useState([]);return c.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{d(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsx(s,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,h)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},h))})]})}},p={args:{...o.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(i,{"aria-label":"Menu",children:"Menu"}),e.jsxs(M,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(g,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(s,{placement:"right top",children:j.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const te=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,u as PreviewAutocompleteMenu,p as Submenu,l as Virtualized,m as VirtualizedMaxHeight,te as __namedExportsOrder,ne as default};
