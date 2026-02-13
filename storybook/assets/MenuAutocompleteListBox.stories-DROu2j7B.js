import{p as L,r as p,j as e}from"./iframe-DfpqVrvR.js";import{M as m,f as d,g,a as k,b as v,S as y}from"./Menu-DZ5E9Lhj.js";import{M as j}from"./index-Rl36dthR.js";import{F as h}from"./Flex-CRP6Vi0B.js";import{T as S}from"./Text-CDQSzM58.js";import{B as x}from"./Button-TfeiOXO3.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-DOkun8P7.js";import"./Separator-SYTwKrv5.js";import"./SelectionManager-DpZ53rlX.js";import"./useFocusable-B0fj9RWB.js";import"./useObjectRef-BmR_ziai.js";import"./clsx-B-dksMZM.js";import"./useEvent-3d0YW6Ok.js";import"./SelectionIndicator-Dog0Yw-2.js";import"./context-BPFNtXgL.js";import"./usePress-BvdgBqzx.js";import"./Hidden-C8w1_qVj.js";import"./useControlledState-_8APqgH2.js";import"./utils-D85nH9kL.js";import"./RSPContexts-VkNHWFAw.js";import"./useLabels-CMDApTWy.js";import"./useLocalizedStringFormatter-CYYTDJfN.js";import"./Button-BiYY6csO.js";import"./Label-BRVqwRDa.js";import"./useLabel-DDRVJ171.js";import"./useButton-BQKo9-MC.js";import"./useFocusRing-d6UxsVGS.js";import"./Input-DMbXCJov.js";import"./useFormReset-Br6fFYC4.js";import"./useField-DWw3Lxh2.js";import"./Form-DeF_n6bD.js";import"./ListBox-Dvkaz2jl.js";import"./Text-B2_hEG-r.js";import"./useListState-CBbSLXZ3.js";import"./Dialog-B-a-_C4v.js";import"./OverlayArrow-khuJnse5.js";import"./animation-CfFGX-BL.js";import"./VisuallyHidden-Dbp0HIz2.js";import"./SearchField-BTffriLX.js";import"./FieldError-DMeMF3Ff.js";import"./useStyles-GmDIvdWy.js";import"./index-oOJVObcy.js";import"./InternalLinkProvider-CBCw26yq.js";import"./useBg-CVukkPNJ.js";import"./defineComponent-CqKmpeur.js";const M=L.meta({title:"Backstage UI/MenuAutocompleteListBox",component:m,decorators:[n=>e.jsx(j,{children:e.jsx(n,{})})]}),s=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=M.story({args:{children:null},render:()=>{const[n,r]=p.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{selectedKeys:n,onSelectionChange:r,children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})}}),i=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{selectedKeys:n,onSelectionChange:r,children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})}}),a=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState(new Set([s[2].value,s[3].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{selectionMode:"multiple",selectedKeys:n,onSelectionChange:r,children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})}}),u=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsxs(k,{children:[e.jsx(v,{children:"Edit"}),e.jsx(v,{children:"Duplicate"}),e.jsxs(y,{children:[e.jsx(v,{children:"Submenu"}),e.jsx(d,{selectedKeys:n,onSelectionChange:r,placement:"right top",children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),l=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState([]);return p.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{r(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{items:n,placeholder:"Search Pokemon...",virtualized:!0,children:n.map((t,b)=>e.jsx(g,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}}),c=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState([]);return p.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{r(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{items:n,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:n.map((t,b)=>e.jsx(g,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Default = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set([options[2].value])
  );

  return (
    <Flex direction="column" gap="2" align="start">
      <Text>Selected: {Array.from(selected).join(", ")}</Text>
      <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuAutocompleteListbox
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {options.map((option) => (
            <MenuListBoxItem key={option.value} id={option.value}>
              {option.label}
            </MenuListBoxItem>
          ))}
        </MenuAutocompleteListbox>
      </MenuTrigger>
    </Flex>
  );
};
`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const PreviewListbox = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set([options[2].value])
  );

  return (
    <Flex direction="column" gap="2" align="center">
      <Text>Selected: {Array.from(selected).join(", ")}</Text>
      <MenuTrigger>
        <Button aria-label="Menu">Menu</Button>
        <MenuAutocompleteListbox
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {options.map((option) => (
            <MenuListBoxItem key={option.value} id={option.value}>
              {option.label}
            </MenuListBoxItem>
          ))}
        </MenuAutocompleteListbox>
      </MenuTrigger>
    </Flex>
  );
};
`,...i.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const PreviewListboxMultiple = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set([options[2].value, options[3].value])
  );

  return (
    <Flex direction="column" gap="2" align="center">
      <Text>Selected: {Array.from(selected).join(", ")}</Text>
      <MenuTrigger>
        <Button aria-label="Menu">Menu</Button>
        <MenuAutocompleteListbox
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {options.map((option) => (
            <MenuListBoxItem key={option.value} id={option.value}>
              {option.label}
            </MenuListBoxItem>
          ))}
        </MenuAutocompleteListbox>
      </MenuTrigger>
    </Flex>
  );
};
`,...a.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Submenu = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set([options[2].value])
  );

  return (
    <Flex direction="column" gap="2" align="start">
      <Text>Selected: {Array.from(selected).join(", ")}</Text>
      <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <Menu>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <SubmenuTrigger>
            <MenuItem>Submenu</MenuItem>
            <MenuAutocompleteListbox
              selectedKeys={selected}
              onSelectionChange={setSelected}
              placement="right top"
            >
              {options.map((option) => (
                <MenuListBoxItem key={option.value} id={option.value}>
                  {option.label}
                </MenuListBoxItem>
              ))}
            </MenuAutocompleteListbox>
          </SubmenuTrigger>
        </Menu>
      </MenuTrigger>
    </Flex>
  );
};
`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const Virtualized = () => {
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
      <MenuAutocompleteListbox
        items={pokemon}
        placeholder="Search Pokemon..."
        virtualized
      >
        {pokemon.map((p, index) => (
          <MenuListBoxItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuListBoxItem>
        ))}
      </MenuAutocompleteListbox>
    </MenuTrigger>
  );
};
`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const VirtualizedMaxHeight = () => {
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
      <MenuAutocompleteListbox
        items={pokemon}
        placeholder="Search Pokemon..."
        virtualized
        maxHeight="300px"
      >
        {pokemon.map((p, index) => (
          <MenuListBoxItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuListBoxItem>
        ))}
      </MenuAutocompleteListbox>
    </MenuTrigger>
  );
};
`,...c.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: null
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value]));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox selectedKeys={selected} onSelectionChange={setSelected}>
            {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>)}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>;
  }
})`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value]));
    return <Flex direction="column" gap="2" align="center">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox selectedKeys={selected} onSelectionChange={setSelected}>
            {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>)}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>;
  }
})`,...i.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value, options[3].value]));
    return <Flex direction="column" gap="2" align="center">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
            {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>)}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>;
  }
})`,...a.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value]));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <Menu>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <SubmenuTrigger>
              <MenuItem>Submenu</MenuItem>
              <MenuAutocompleteListbox selectedKeys={selected} onSelectionChange={setSelected} placement="right top">
                {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                    {option.label}
                  </MenuListBoxItem>)}
              </MenuAutocompleteListbox>
            </SubmenuTrigger>
          </Menu>
        </MenuTrigger>
      </Flex>;
  }
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <MenuAutocompleteListbox items={pokemon} placeholder="Search Pokemon..." virtualized>
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuAutocompleteListbox>
      </MenuTrigger>;
  }
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <MenuAutocompleteListbox items={pokemon} placeholder="Search Pokemon..." virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuAutocompleteListbox>
      </MenuTrigger>;
  }
})`,...c.input.parameters?.docs?.source}}};const he=["Default","PreviewListbox","PreviewListboxMultiple","Submenu","Virtualized","VirtualizedMaxHeight"];export{o as Default,i as PreviewListbox,a as PreviewListboxMultiple,u as Submenu,l as Virtualized,c as VirtualizedMaxHeight,he as __namedExportsOrder};
