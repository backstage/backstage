import{p as L,r as p,j as e}from"./iframe-CNJ8DcrC.js";import{M as m,f as d,g,a as k,b as v,S as y}from"./Menu-D63Jv5B2.js";import{M as j}from"./index-DkthXm2e.js";import{F as h}from"./Flex-gznhGsL1.js";import{T as S}from"./Text-DZ9ojE3W.js";import{B as x}from"./Button-Vzu3Jvbs.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-DetZC639.js";import"./Separator-Q4nsgSR4.js";import"./SelectionManager-3zHy28g_.js";import"./useFocusable-BRngNkQp.js";import"./useObjectRef-D4VDTdyV.js";import"./clsx-B-dksMZM.js";import"./useEvent-BTL2BJnf.js";import"./SelectionIndicator-B--I21Py.js";import"./context-BaC93-pS.js";import"./usePress-D634pjUp.js";import"./Hidden-ubLVAw13.js";import"./useControlledState-CqjGTBew.js";import"./utils-DqzyTKhZ.js";import"./RSPContexts-6RDiUzJW.js";import"./useLabels-CtOTMY5s.js";import"./useLocalizedStringFormatter-BNUwPyU_.js";import"./Button-BeiFbECh.js";import"./Label-CJ-vxwqW.js";import"./useLabel-BZdBZ-M8.js";import"./useButton-CBYUCijk.js";import"./useFocusRing-_R5-3ahM.js";import"./Input-Bx1Q9ja8.js";import"./useFormReset-CElrKw0c.js";import"./useField-DsFdjrH-.js";import"./Form-y2WNsJvz.js";import"./ListBox-BhddLFLW.js";import"./Text-Cn9vnNz6.js";import"./useListState-DHoCQKk8.js";import"./Dialog-DhxMaNxl.js";import"./OverlayArrow-DbM2lv9Q.js";import"./animation-CFsi5qUo.js";import"./VisuallyHidden-CxpG0c7s.js";import"./SearchField-zRsAF-St.js";import"./FieldError-ed3rL4L6.js";import"./useStyles-Ctwz8Mdy.js";import"./index-Bscon1G1.js";import"./InternalLinkProvider-BkNugvJ-.js";import"./useSurface-psgZOnSF.js";import"./defineComponent-B_6e1-Ln.js";const M=L.meta({title:"Backstage UI/MenuAutocompleteListBox",component:m,decorators:[n=>e.jsx(j,{children:e.jsx(n,{})})]}),s=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=M.story({args:{children:null},render:()=>{const[n,r]=p.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{selectedKeys:n,onSelectionChange:r,children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})}}),i=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{selectedKeys:n,onSelectionChange:r,children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})}}),a=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState(new Set([s[2].value,s[3].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{selectionMode:"multiple",selectedKeys:n,onSelectionChange:r,children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})}}),u=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(n).join(", ")]}),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsxs(k,{children:[e.jsx(v,{children:"Edit"}),e.jsx(v,{children:"Duplicate"}),e.jsxs(y,{children:[e.jsx(v,{children:"Submenu"}),e.jsx(d,{selectedKeys:n,onSelectionChange:r,placement:"right top",children:s.map(t=>e.jsx(g,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),l=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState([]);return p.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{r(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{items:n,placeholder:"Search Pokemon...",virtualized:!0,children:n.map((t,b)=>e.jsx(g,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}}),c=M.story({args:{...o.input.args},render:()=>{const[n,r]=p.useState([]);return p.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{r(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(x,{"aria-label":"Menu",children:"Menu"}),e.jsx(d,{items:n,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:n.map((t,b)=>e.jsx(g,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Default = () => {
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
