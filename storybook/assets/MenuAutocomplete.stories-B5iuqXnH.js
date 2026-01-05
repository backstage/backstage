import{a3 as g,j as e,r as d}from"./iframe-BuVoE93N.js";import{M as a,e as i,b as n,a as x,S as j}from"./Menu-BPtHSFe-.js";import{M as I}from"./index-CLOs8FQP.js";import{B as s}from"./Button-CT5YVmuJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-CI7cOcwf.js";import"./ListBox-DeCPxRoJ.js";import"./useListState-u7_c8PdC.js";import"./useFocusable-RA6jfmYm.js";import"./useObjectRef-ItgVE3gr.js";import"./clsx-B-dksMZM.js";import"./usePress-BO0EYF12.js";import"./useEvent-6IeNPFHf.js";import"./SelectionIndicator-PApIX5SC.js";import"./context-CfDu8YeJ.js";import"./Hidden-Br-0R2I4.js";import"./useControlledState-D8DKX6de.js";import"./utils-CneUsgZM.js";import"./RSPContexts-Dn9cDWIT.js";import"./Text-BqLAadev.js";import"./useLabel-Vl7t33Fq.js";import"./useLabels-C_FR2IEV.js";import"./useFocusRing-Bb1p8O5x.js";import"./useLocalizedStringFormatter-DKv2rXP_.js";import"./Button-7Hrhg6xR.js";import"./Label-BC4l9JvA.js";import"./OverlayArrow-Cv4AYZxd.js";import"./VisuallyHidden-CrQGUS6-.js";import"./Input-ChVbCjWh.js";import"./useFormReset-Bvb4nFys.js";import"./Form-v5TsksCO.js";import"./SearchField-h0gf3ljL.js";import"./FieldError-DXdn77wY.js";import"./useStyles-D9NCobyQ.js";import"./index-CfjEZQXP.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BPzqtDAO.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(I,{children:e.jsx(t,{})})]}),b=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),l=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(r=>r.json()).then(r=>{h(r.results)}).catch(r=>{console.error("Error fetching Pokemon:",r)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((r,M)=>e.jsx(n,{id:r.name,children:r.name.charAt(0).toLocaleUpperCase("en-US")+r.name.slice(1)},M))})]})}}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(r=>r.json()).then(r=>{h(r.results)}).catch(r=>{console.error("Error fetching Pokemon:",r)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((r,M)=>e.jsx(n,{id:r.name,children:r.name.charAt(0).toLocaleUpperCase("en-US")+r.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(x,{children:[e.jsx(n,{children:"Edit"}),e.jsx(n,{children:"Duplicate"}),e.jsxs(j,{children:[e.jsx(n,{children:"Submenu"}),e.jsx(i,{placement:"right top",children:b.map(t=>e.jsx(n,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
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
})`,...l.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
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
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
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
})`,...p.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
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
})`,...c.input.parameters?.docs?.source}}};const oe=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,l as PreviewAutocompleteMenu,c as Submenu,m as Virtualized,p as VirtualizedMaxHeight,oe as __namedExportsOrder};
