import{p as h,j as e,r as M}from"./iframe-BRAtl1PG.js";import{M as m,e as p,b as n,a as I,S as x}from"./Menu-DgYy4EcT.js";import{M as b}from"./index-UAXk7FN5.js";import{B as l}from"./Button-yHkooEfJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-_zC2aHsd.js";import"./Separator-D8tppAvH.js";import"./SelectionManager-BHJ5xNUD.js";import"./useFocusable-0qUJirAR.js";import"./useObjectRef-Dc1sO3MT.js";import"./clsx-B-dksMZM.js";import"./useEvent-Cigf-EQX.js";import"./SelectionIndicator-B1bRBkmg.js";import"./context-D1SMRDdd.js";import"./usePress-DIIbHTTm.js";import"./Hidden-DicFgWdz.js";import"./useControlledState-6k6fWrsQ.js";import"./utils-D7kNhbe6.js";import"./RSPContexts-Dh_9-Yxh.js";import"./useLabels-PNc9NjkO.js";import"./useLocalizedStringFormatter-BFgC9hL7.js";import"./Button-nQ5DYv4P.js";import"./Label-5zGOGrOl.js";import"./useLabel--KKQS_bi.js";import"./useButton-DEVYzQ20.js";import"./useFocusRing-D3wog3RJ.js";import"./Input-CiPBDVkV.js";import"./useFormReset-DLhS-t7Q.js";import"./useField-DbkeB1hk.js";import"./Form-Bs4y_6yb.js";import"./ListBox-CL3Rj8nR.js";import"./Text-cS4xiO9l.js";import"./useListState-BLLB0J8u.js";import"./Dialog-B6OJ5eqy.js";import"./OverlayArrow-BKbQwX00.js";import"./animation-B5OcLLaG.js";import"./VisuallyHidden-HlVBVmH7.js";import"./SearchField-B1CRt5DF.js";import"./FieldError-BQA_iG05.js";import"./useStyles-DsD2Ie5u.js";import"./index-BSjwzBH4.js";import"./InternalLinkProvider-B6zcEzBa.js";import"./defineComponent-Dpg8AAhQ.js";import"./useSurface-BG8rQ60O.js";const c=h.meta({title:"Backstage UI/MenuAutocomplete",component:m,decorators:[o=>e.jsx(b,{children:e.jsx(o,{})})]}),k=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],r=c.story({args:{children:null},render:()=>e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),u=c.story({args:{...r.input.args},render:()=>e.jsxs(m,{children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),a=c.story({args:{...r.input.args},render:()=>{const[o,d]=M.useState([]);return M.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{d(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:o,placeholder:"Search Pokemon...",virtualized:!0,children:o.map((t,g)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},g))})]})}}),i=c.story({args:{...r.input.args},render:()=>{const[o,d]=M.useState([]);return M.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{d(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:o,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:o.map((t,g)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},g))})]})}}),s=c.story({args:{...r.input.args},render:()=>e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(I,{children:[e.jsx(n,{children:"Edit"}),e.jsx(n,{children:"Duplicate"}),e.jsxs(x,{children:[e.jsx(n,{children:"Submenu"}),e.jsx(p,{placement:"right top",children:k.map(o=>e.jsx(n,{id:o.value,children:o.label},o.value))})]})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => (
  <MenuTrigger isOpen>
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
);
`,...r.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const PreviewAutocompleteMenu = () => (
  <MenuTrigger>
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
);
`,...u.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Virtualized = () => {
  const [pokemon, setPokemon] = useState<Array<{ name: string; url: string }>>(
    []
  );

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon:", error);
      });
  }, []);

  return (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete
        items={pokemon}
        placeholder="Search Pokemon..."
        virtualized
      >
        {pokemon.map((p, index) => (
          <MenuItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuItem>
        ))}
      </MenuAutocomplete>
    </MenuTrigger>
  );
};
`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const VirtualizedMaxHeight = () => {
  const [pokemon, setPokemon] = useState<Array<{ name: string; url: string }>>(
    []
  );

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon:", error);
      });
  }, []);

  return (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete
        items={pokemon}
        placeholder="Search Pokemon..."
        virtualized
        maxHeight="300px"
      >
        {pokemon.map((p, index) => (
          <MenuItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuItem>
        ))}
      </MenuAutocomplete>
    </MenuTrigger>
  );
};
`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Submenu = () => (
  <MenuTrigger isOpen>
    <Button aria-label="Menu">Menu</Button>
    <Menu>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <SubmenuTrigger>
        <MenuItem>Submenu</MenuItem>
        <MenuAutocomplete placement="right top">
          {options.map((option) => (
            <MenuItem key={option.value} id={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MenuAutocomplete>
      </SubmenuTrigger>
    </Menu>
  </MenuTrigger>
);
`,...s.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const le=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{r as Default,u as PreviewAutocompleteMenu,s as Submenu,a as Virtualized,i as VirtualizedMaxHeight,le as __namedExportsOrder};
