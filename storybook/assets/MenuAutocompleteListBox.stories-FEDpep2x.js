import{r as s,j as e,p as v,M as y}from"./iframe-BIybnMXI.js";import{F as M}from"./Flex-CFkcabei.js";import{a,f as l,g as u,b as f,M as j,S as k}from"./Menu-Cb7omWrx.js";import{B}from"./BUIProvider-BGFGf2ST.js";import{T as S}from"./Text-kzCYyEIk.js";import{B as p}from"./Button-BUdpgB5l.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-Dq4_Bll7.js";import"./utils-BNWuCLNS.js";import"./useObjectRef-CbQSD8dp.js";import"./keyboard-QYh7qiEd.js";import"./useFocusRing-14fD-rIq.js";import"./openLink-_nIoHyS5.js";import"./getMetaValue-BRyplxPo.js";import"./useEvent-DIefrTiE.js";import"./useLabels-BYUTWxfw.js";import"./useLocalizedStringFormatter-DqXT6BB6.js";import"./I18nProvider-CQNLYzfm.js";import"./useControlledState-CPQ03ATl.js";import"./Button-ejIqj8kn.js";import"./Label-DU9qK1mL.js";import"./Hidden-CFw0S2EP.js";import"./useLabel-DOK2Qr8p.js";import"./number-DllxhX9c.js";import"./useButton-DMoQoLuK.js";import"./usePress-BTAge9_g.js";import"./textSelection-Dxc81R1_.js";import"./useHover-S-WcK3-g.js";import"./useLoadMoreSentinel-BkCjiMYy.js";import"./useCollection-CEagf3y0.js";import"./FocusScope-Dr9kUHv8.js";import"./Input-DW6Ftfr4.js";import"./ListBox-cv5bBszz.js";import"./SelectionIndicator-Bphfg2M8.js";import"./Text-BmQ5Jf8N.js";import"./useListState-C6sSAmPu.js";import"./Dialog-P2aWfCr-.js";import"./Heading-Bpc_kUuP.js";import"./useOverlayTriggerState-Dl82bCOM.js";import"./VisuallyHidden-BHXmXcE_.js";import"./animation-ChJpkI5_.js";import"./SearchField-CExVv26X.js";import"./FieldError-BHpvYtcE.js";import"./Form-BtbuUqgK.js";import"./useFormValidation-CvU55wbv.js";import"./useTextField-DTDPL3Jy.js";import"./useField-Di3KpqBE.js";import"./useFormReset-DCi4NeAi.js";import"./Virtualizer-G1fyxnzt.js";import"./useFilter-dFEuKb-v.js";import"./index-DRRrr8Fx.js";import"./getNodeText-De_eihzQ.js";import"./BUIRoutingProvider-CnIqwql2.js";import"./useResolvedHref-Cp7X7JN9.js";const c=v.meta({title:"Backstage UI/MenuAutocompleteListBox",component:a,decorators:[r=>e.jsx(y,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),i=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],n=c.story({args:{children:null},render:()=>{const[r,o]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),m=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),d=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState(new Set([i[2].value,i[3].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:o,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),x=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(f,{children:[e.jsx(j,{children:"Edit"}),e.jsx(j,{children:"Duplicate"}),e.jsxs(k,{children:[e.jsx(j,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,placement:"right top",children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),g=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},b))})]})}}),h=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},b))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
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
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuAutocompleteListbox>
      </MenuTrigger>;
  }
})`,...h.input.parameters?.docs?.source}}};const Le=["Default","PreviewListbox","PreviewListboxMultiple","Submenu","Virtualized","VirtualizedMaxHeight"];export{n as Default,m as PreviewListbox,d as PreviewListboxMultiple,x as Submenu,g as Virtualized,h as VirtualizedMaxHeight,Le as __namedExportsOrder};
