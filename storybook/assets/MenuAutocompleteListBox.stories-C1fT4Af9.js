import{r as s,j as e,p as v,M as y}from"./iframe-t9H7a1GP.js";import{F as M}from"./Flex-DeJYVe0t.js";import{a,f as l,g as u,b as f,M as j,S as k}from"./Menu-BuQWIwHZ.js";import{B as L}from"./BUIProvider-DkLDzyw8.js";import{T as S}from"./Text-nAVLbsLA.js";import{B as c}from"./Button-BJosQ2eX.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-BaTK0OPO.js";import"./utils-B_HK0fZy.js";import"./useObjectRef-D-LfZK3P.js";import"./keyboard-CM4wuuwl.js";import"./useFocusRing-DNWvY8RS.js";import"./openLink-B2Zr3UoO.js";import"./useEvent-Ch2RdOnN.js";import"./useLabels-C5_jB9N4.js";import"./useLocalizedStringFormatter-DhiAY8I9.js";import"./I18nProvider-IedlwoY8.js";import"./useControlledState-DpMbG7KC.js";import"./Button-BO1t6O6T.js";import"./Label-BJGo-8TB.js";import"./Hidden-CpRkSTHD.js";import"./useLabel-DKCkml_f.js";import"./number-DYBOfH25.js";import"./useButton-rKZR3HiN.js";import"./usePress-C_lRFzPq.js";import"./textSelection-Dq7X0EAE.js";import"./useHover-qr3gz19p.js";import"./getItemCount-DtWFxvPb.js";import"./useCollection-CYvCL1ii.js";import"./FocusScope-B32KV7sa.js";import"./Input-ChvyHnwH.js";import"./ListBox-DWfVfPEa.js";import"./Text-BFIdZobh.js";import"./useListState-DZw3CQnM.js";import"./Dialog-DNGu89DR.js";import"./Heading-DhXyn_3i.js";import"./useOverlayTriggerState-NopRWek4.js";import"./VisuallyHidden-Ber9pqXl.js";import"./animation-Cm5xaXnR.js";import"./SearchField-Dz0UyMzp.js";import"./FieldError-CTPduq9I.js";import"./useFormValidation-C7fFAsQQ.js";import"./useTextField-C-ULO0ld.js";import"./useField-BjWwUXpF.js";import"./useFormReset-AFJ5yClQ.js";import"./Virtualizer-MQkCRMxU.js";import"./useFilter-CECzPmg3.js";import"./index-B2o8Nitq.js";import"./getNodeText-DbS2Az2E.js";import"./useResolvedHref-ByM8xp8i.js";const p=v.meta({title:"Backstage UI/MenuAutocompleteListBox",component:a,decorators:[r=>e.jsx(y,{children:e.jsx(L,{children:e.jsx(r,{})})})]}),i=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=p.story({args:{children:null},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),m=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),d=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value,i[3].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:n,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),x=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsxs(f,{children:[e.jsx(j,{children:"Edit"}),e.jsx(j,{children:"Duplicate"}),e.jsxs(k,{children:[e.jsx(j,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:n,placement:"right top",children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),g=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{n(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}}),h=p.story({args:{...o.input.args},render:()=>{const[r,n]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{n(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(c,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},b))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
