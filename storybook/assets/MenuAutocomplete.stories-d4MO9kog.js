import{a3 as g,j as e,r as d}from"./iframe-BY8lR-L8.js";import{M as a,e as i,b as n,a as x,S as j}from"./Menu-BTigrKK4.js";import{M as I}from"./index-BS6rRTnv.js";import{B as s}from"./Button-B2n63W61.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-DWCj1D1z.js";import"./ListBox-PIasHsVA.js";import"./useListState-BajvDkMa.js";import"./useFocusable-C9C81vz2.js";import"./useObjectRef-BqHG6lM5.js";import"./clsx-B-dksMZM.js";import"./usePress-BOtSC_Hg.js";import"./useEvent-DJMP_cBu.js";import"./SelectionIndicator-_0G77Na2.js";import"./context-BawLJTMw.js";import"./Hidden-BOGSyjem.js";import"./useControlledState--yapVw-x.js";import"./utils-Bfoe0K7S.js";import"./RSPContexts-CKOFLTkU.js";import"./Text-BKaXOxx7.js";import"./useLabel-C6JDtQl3.js";import"./useLabels-BYtztTEe.js";import"./useFocusRing-BEbWKVlK.js";import"./useLocalizedStringFormatter-DWxB_tcq.js";import"./Button-DZR8lu4n.js";import"./Label-g_-FIzgL.js";import"./OverlayArrow-Baucl-Ka.js";import"./VisuallyHidden-eBlVDRmb.js";import"./Input-Cwa4mYR8.js";import"./useFormReset-SyrVROTP.js";import"./Form-B7AsXGvr.js";import"./SearchField-CgV6XqC-.js";import"./FieldError-j_Sj5TL2.js";import"./useStyles-DPxfsz7Y.js";import"./index-BNUW6RWV.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BPzqtDAO.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(I,{children:e.jsx(t,{})})]}),b=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),l=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(r=>r.json()).then(r=>{h(r.results)}).catch(r=>{console.error("Error fetching Pokemon:",r)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((r,M)=>e.jsx(n,{id:r.name,children:r.name.charAt(0).toLocaleUpperCase("en-US")+r.name.slice(1)},M))})]})}}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(r=>r.json()).then(r=>{h(r.results)}).catch(r=>{console.error("Error fetching Pokemon:",r)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((r,M)=>e.jsx(n,{id:r.name,children:r.name.charAt(0).toLocaleUpperCase("en-US")+r.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(x,{children:[e.jsx(n,{children:"Edit"}),e.jsx(n,{children:"Duplicate"}),e.jsxs(j,{children:[e.jsx(n,{children:"Submenu"}),e.jsx(i,{placement:"right top",children:b.map(t=>e.jsx(n,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
