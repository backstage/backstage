import{ca as s,bR as e,c7 as v,w as y}from"./iframe-X5mwL4tp.js";import{F as M}from"./Flex-B7o_ie7R.js";import{h as a,b as l,e as u,M as f,c as j,S as k}from"./Menu-uIwgOfaV.js";import{B as L}from"./BUIProvider-gHi16S2c.js";import{T as S}from"./Text-DuxikEFP.js";import{B as c}from"./Button-BI0OO5_R.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-DZgLERJG.js";import"./utils-DbglA0qc.js";import"./useObjectRef-B4ikIkxr.js";import"./keyboard-SH1FHugW.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./useEvent-B9gIp-0I.js";import"./useLabels-CyId-J7Z.js";import"./useLocalizedStringFormatter-DJopSl5i.js";import"./I18nProvider-Cp8YwWQe.js";import"./useControlledState-VUJiIP94.js";import"./Button-Mr7_7LVv.js";import"./Label-Du0ObhKE.js";import"./Hidden-DXcGagMc.js";import"./useLabel-DttWp7u_.js";import"./number-BgaIE-sV.js";import"./useButton-b3MTXzJF.js";import"./usePress-C87_1f3H.js";import"./textSelection-DtJZPEXI.js";import"./useHover-iQz_in6H.js";import"./getItemCount-CCMQjwsk.js";import"./useCollection-D6kXv1i_.js";import"./FocusScope-ChrxsfV7.js";import"./Input-DJuIrIG0.js";import"./ListBox-Dw_6YJ7x.js";import"./Text-D1k2Dp8f.js";import"./useListState-Dtv5tBCM.js";import"./Dialog-hwZzxVwX.js";import"./Heading-BUx8lHFH.js";import"./useOverlayTriggerState-DadPaReJ.js";import"./VisuallyHidden-D2nFrwYc.js";import"./animation-DwrFgyaB.js";import"./SearchField-CFnfufPI.js";import"./FieldError-D3Li39rU.js";import"./useFormValidation-hr5mEY2s.js";import"./useTextField-DinD4WeQ.js";import"./useField-O4p38GKT.js";import"./useFormReset-DGDQjoCT.js";import"./Virtualizer-u-9zRlic.js";import"./useFilter-CVSTsY3u.js";import"./index-BaDW95zO.js";import"./getNodeText-DuOZZozu.js";import"./useResolvedHref-v0hr4wbk.js";const p=v.meta({title:"Backstage UI/MenuAutocompleteListBox",component:a,decorators:[r=>e.jsx(y,{children:e.jsx(L,{children:e.jsx(r,{})})})]}),i=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=p.story({args:{children:null},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),m=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),d=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value,i[3].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),x=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsxs(f,{children:[e.jsx(j,{children:"Edit"}),e.jsx(j,{children:"Duplicate"}),e.jsxs(k,{children:[e.jsx(j,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,placement:"right top",children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),g=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{n(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}}),h=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{n(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};const ye=["Default","PreviewListbox","PreviewListboxMultiple","Submenu","Virtualized","VirtualizedMaxHeight"];export{o as Default,m as PreviewListbox,d as PreviewListboxMultiple,x as Submenu,g as Virtualized,h as VirtualizedMaxHeight,ye as __namedExportsOrder};
