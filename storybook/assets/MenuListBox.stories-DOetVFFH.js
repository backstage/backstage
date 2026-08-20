import{ca as s,bR as e,c7 as h,w as g}from"./iframe-BHoENCVc.js";import{F as M}from"./Flex-BjDv317b.js";import{h as a,d as c,e as n}from"./Menu-xKZm1HVK.js";import{B}from"./BUIProvider-BqojK_vt.js";import{T as j}from"./Text-s-AhUfle.js";import{B as l}from"./Button-CPhhNFLc.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-Bgw_Gpoz.js";import"./utils-CL0Z8V1C.js";import"./useObjectRef-uSeYP5xn.js";import"./keyboard-CQek5qZh.js";import"./useFocusRing-MHb5XFUp.js";import"./openLink-DZP0UHC7.js";import"./useEvent-CcBfYwbm.js";import"./useLabels-Dx4Y77vh.js";import"./useLocalizedStringFormatter-BaNttnCu.js";import"./I18nProvider-BHwrJH4v.js";import"./useControlledState--Wz_vfvx.js";import"./Button-BHRDpgL_.js";import"./Label-DlD4XAby.js";import"./Hidden-C6_e4Tzz.js";import"./useLabel-DLz-9M9H.js";import"./number-CnfK_WTv.js";import"./useButton-DPa3LWsd.js";import"./usePress-D96lUmWf.js";import"./textSelection-Di8U28Mz.js";import"./useHover-CPCQZiGU.js";import"./getItemCount-CZxrPbgG.js";import"./useCollection-CvCJeEFX.js";import"./FocusScope-9n4xhBQA.js";import"./Input-BO0IQHQF.js";import"./ListBox-A5L7mExS.js";import"./Text-C8x2cVH5.js";import"./useListState-vDCPlgz-.js";import"./Dialog-Dl2D-CV-.js";import"./Heading-BT5dE8Rd.js";import"./useOverlayTriggerState-Cx2c-3-p.js";import"./VisuallyHidden-q8nayOEv.js";import"./animation-D48GeWFv.js";import"./SearchField-D81loRcG.js";import"./FieldError-ByCYa549.js";import"./useFormValidation-BwtogCRU.js";import"./useTextField-DggYGt4Z.js";import"./useField-DUlTbCPt.js";import"./useFormReset-lwOM45Sr.js";import"./Virtualizer-DblGK9ID.js";import"./useFilter-L39FFgK3.js";import"./index-CXAyTdUW.js";import"./getNodeText-DSCCppXL.js";import"./useResolvedHref-KjDbaJ0G.js";const d=h.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(g,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),o=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})}),m=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}}),u=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: null
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuListBox>
        <MenuListBoxItem>Item 1</MenuListBoxItem>
        <MenuListBoxItem>Item 2</MenuListBoxItem>
        <MenuListBoxItem>Item 3</MenuListBoxItem>
      </MenuListBox>
    </MenuTrigger>
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set(['paul']));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuListBox selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
            <MenuListBoxItem key="item1" id="john">
              John Lennon
            </MenuListBoxItem>
            <MenuListBoxItem key="item2" id="paul">
              Paul McCartney
            </MenuListBoxItem>
            <MenuListBoxItem key="item3" id="george">
              George Harrison
            </MenuListBoxItem>
            <MenuListBoxItem key="item4" id="ringo">
              Ringo Starr
            </MenuListBoxItem>
          </MenuListBox>
        </MenuTrigger>
      </Flex>;
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
        <MenuListBox items={pokemon} virtualized>
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <MenuListBox items={pokemon} virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...u.input.parameters?.docs?.source}}};const ge=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,p as Virtualized,u as VirtualizedMaxHeight,ge as __namedExportsOrder};
