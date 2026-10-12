import{r as s,j as e,p as v,M as y}from"./iframe-D5t0zV2Z.js";import{F as M}from"./Flex-B_Db5ot6.js";import{a,f as l,g as u,b as f,M as j,S as k}from"./Menu-DYKX3y-n.js";import{B}from"./BUIProvider-1V_oyFR4.js";import{T as S}from"./Text-DICziNDH.js";import{B as p}from"./Button-CpidWcoX.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-C2BxSGXK.js";import"./utils-C39--9xx.js";import"./useObjectRef-kGsiECgS.js";import"./keyboard-vsvxufhh.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./getMetaValue-lPtVOvv4.js";import"./useEvent-Ky4nwph9.js";import"./useLabels-D8GfqFut.js";import"./useLocalizedStringFormatter-Dq7SKV2-.js";import"./I18nProvider-CnCaeKRg.js";import"./useControlledState-CWsOmoBN.js";import"./Button-DnnkrgV8.js";import"./Label-DaItaSZn.js";import"./Hidden-Dsa08sWj.js";import"./useLabel-32i4SIb0.js";import"./number-DtQkEWx4.js";import"./useButton-DdkvoT6L.js";import"./usePress-Dmt7pnzP.js";import"./textSelection-FMDS3d8l.js";import"./useHover-CMgWw-jG.js";import"./useLoadMoreSentinel-D0yXM04e.js";import"./useCollection-D9Ya-DMs.js";import"./FocusScope-B3AKJWwl.js";import"./Input-B8KQxdZr.js";import"./ListBox-DuO79u2v.js";import"./SelectionIndicator-CvD_mVQX.js";import"./Text--erJL1eo.js";import"./useListState-CSvV5XS2.js";import"./Dialog-WOQVM2qV.js";import"./Heading-WJeSrVAJ.js";import"./useOverlayTriggerState-D9dRXQwO.js";import"./VisuallyHidden-CfB2zf9t.js";import"./animation-COaRnszU.js";import"./SearchField-DGh4rKVQ.js";import"./FieldError-BufNcm74.js";import"./Form-RnyeY1Wv.js";import"./useFormValidation-DF0-wOxW.js";import"./useTextField-BqFVkvRL.js";import"./useField-B9NwoH1a.js";import"./useFormReset-B281acCK.js";import"./Virtualizer-CTTIRba9.js";import"./useFilter-YxJTrxQ1.js";import"./index-DvEtjejY.js";import"./getNodeText-IxDMTKQ7.js";import"./BUIRoutingProvider-Bi_Kr0PI.js";import"./useResolvedHref-BwjjIWjA.js";const c=v.meta({title:"Backstage UI/MenuAutocompleteListBox",component:a,decorators:[r=>e.jsx(y,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),i=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],n=c.story({args:{children:null},render:()=>{const[r,o]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),m=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),d=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState(new Set([i[2].value,i[3].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"center",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:o,children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})}}),x=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState(new Set([i[2].value]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(S,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(f,{children:[e.jsx(j,{children:"Edit"}),e.jsx(j,{children:"Duplicate"}),e.jsxs(k,{children:[e.jsx(j,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,placement:"right top",children:i.map(t=>e.jsx(u,{id:t.value,children:t.label},t.value))})]})]})]})]})}}),g=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},b))})]})}}),h=c.story({args:{...n.input.args},render:()=>{const[r,o]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,b)=>e.jsx(u,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},b))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
