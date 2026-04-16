import{r as s,j as e,p as v,M as y}from"./iframe-B7ESvRaB.js";import{F as M}from"./Flex-Cmpf98Na.js";import{M as a,f as l,g as u,a as f,b as j,S as k}from"./Menu-DCUnT5Am.js";import{B as L}from"./BUIProvider-sIkzvwhM.js";import{T as S}from"./Text-2w665EoO.js";import{B as c}from"./Button-DwAJKMZz.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-CNmEvmEM.js";import"./utils-Cr8yviUJ.js";import"./useObjectRef-Dd7TU9CZ.js";import"./keyboard-D5YIFYbX.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./openLink-BFNE09ao.js";import"./useEvent-DHH67uGj.js";import"./useLabels-CZf5BL8e.js";import"./useLocalizedStringFormatter-DDwB1B3c.js";import"./I18nProvider-BeIWmuaR.js";import"./useControlledState-CAbD27ky.js";import"./Button-CkPxspJE.js";import"./Label-B06uCzgg.js";import"./Hidden-CK51uwW5.js";import"./useLabel-4lo-IT0x.js";import"./number-DKEC05wv.js";import"./useButton-DtXFNKA5.js";import"./usePress-HRSvR9KN.js";import"./textSelection-XuXSjEvl.js";import"./useHover-ByBQ7Oss.js";import"./getItemCount-DH8ckQTJ.js";import"./useCollection-BY8iat3j.js";import"./FocusScope-BH80Flu8.js";import"./useTextField-Cr00JWXn.js";import"./useField-BUR4AR8N.js";import"./useFormReset-Cx4bKIVX.js";import"./useFormValidation-b6a5_FZR.js";import"./ListBox-Dy1BN8xK.js";import"./Text-DRd6SIAI.js";import"./useListState-Dp5LXYnH.js";import"./Dialog-B8ZfYxUf.js";import"./Heading-CAK7K7Ei.js";import"./useOverlayTriggerState-BQI29lrc.js";import"./VisuallyHidden-BCbZC_pS.js";import"./animation-Dck7a-0Y.js";import"./SearchField-CNcmfNuo.js";import"./FieldError-eB_pr8Wa.js";import"./Virtualizer-BuzZbCd_.js";import"./useFilter-BTettxGt.js";import"./index-DbP8Hxod.js";import"./linkUtils-tKDL5Jm1.js";import"./getNodeText-C-fdRcD6.js";const p=v.meta({title:"Backstage UI/MenuAutocompleteListBox",component:a,decorators:[r=>e.jsx(y,{children:e.jsx(L,{children:e.jsx(r,{})})})]}),i=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=p.story({args:{children:null},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),m=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),d=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value,i[3].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),x=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsxs(f,{children:[e.jsx(j,{children:"Edit"}),e.jsx(j,{children:"Duplicate"}),e.jsxs(k,{children:[e.jsx(j,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,placement:"right top",children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),g=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{n(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}}),h=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{n(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};const ve=["Default","PreviewListbox","PreviewListboxMultiple","Submenu","Virtualized","VirtualizedMaxHeight"];export{o as Default,m as PreviewListbox,d as PreviewListboxMultiple,x as Submenu,g as Virtualized,h as VirtualizedMaxHeight,ve as __namedExportsOrder};
