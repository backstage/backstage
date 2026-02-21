import{p as h,j as e,r as M}from"./iframe-DLGvYYIN.js";import{M as m,e as p,b as n,a as I,S as x}from"./Menu-BfE-84Bd.js";import{M as b}from"./index-CzwyT08Z.js";import{B as l}from"./Button--n7o5i8w.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-CQPzL6In.js";import"./Separator-GASCjU97.js";import"./SelectionManager-BNlPcQYT.js";import"./useFocusable-Dwm0K710.js";import"./useObjectRef-Ect8Gev2.js";import"./clsx-B-dksMZM.js";import"./useEvent-CTDly4t7.js";import"./SelectionIndicator-mqraHhaA.js";import"./context-BsjhEFst.js";import"./usePress-DGN80X54.js";import"./Hidden-BiplkOmj.js";import"./useControlledState-C90YTTdn.js";import"./utils-BKU3eNrT.js";import"./RSPContexts-B3t8rCy0.js";import"./useLabels-C_Rfoobl.js";import"./useLocalizedStringFormatter-CZnB6PUn.js";import"./Button-DC8vqbSq.js";import"./Label-BDnMaA-I.js";import"./useLabel-DNuxLRzE.js";import"./useButton-cRNKTziG.js";import"./useFocusRing-CD70HxW8.js";import"./Input-B3VykggC.js";import"./useFormReset-TisnJrqe.js";import"./useField-CwmPJbJV.js";import"./Form-PjCepvPz.js";import"./ListBox-BTR2jCS4.js";import"./Text-BCKspdXL.js";import"./useListState-DT3F-ewE.js";import"./Dialog-ChLmv43Q.js";import"./OverlayArrow-CCWdxfpZ.js";import"./animation-f8ARPuKm.js";import"./VisuallyHidden-D2C475Vi.js";import"./SearchField-DNzo14G-.js";import"./FieldError-Mg77bb2r.js";import"./useStyles-BrjVdodu.js";import"./index-VElce4Ke.js";import"./InternalLinkProvider-B2a-Aw2B.js";import"./defineComponent-ZL5_ww2K.js";import"./useBg-CiE6NOBy.js";const c=h.meta({title:"Backstage UI/MenuAutocomplete",component:m,decorators:[o=>e.jsx(b,{children:e.jsx(o,{})})]}),k=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],r=c.story({args:{children:null},render:()=>e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),u=c.story({args:{...r.input.args},render:()=>e.jsxs(m,{children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),a=c.story({args:{...r.input.args},render:()=>{const[o,d]=M.useState([]);return M.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{d(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:o,placeholder:"Search Pokemon...",virtualized:!0,children:o.map((t,g)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},g))})]})}}),i=c.story({args:{...r.input.args},render:()=>{const[o,d]=M.useState([]);return M.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{d(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:o,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:o.map((t,g)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},g))})]})}}),s=c.story({args:{...r.input.args},render:()=>e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(I,{children:[e.jsx(n,{children:"Edit"}),e.jsx(n,{children:"Duplicate"}),e.jsxs(x,{children:[e.jsx(n,{children:"Submenu"}),e.jsx(p,{placement:"right top",children:k.map(o=>e.jsx(n,{id:o.value,children:o.label},o.value))})]})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => (
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
