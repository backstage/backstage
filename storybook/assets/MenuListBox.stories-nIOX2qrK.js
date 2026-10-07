import{r as s,j as e,p as g,M as h}from"./iframe-DsaViRt6.js";import{F as M}from"./Flex-DTjaEUPS.js";import{a,h as c,g as n}from"./Menu-Dyu8ce1U.js";import{B}from"./BUIProvider-CSv_q2aR.js";import{T as j}from"./Text-CL9Rzloh.js";import{B as l}from"./Button-DP-_6VGU.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-I0IZMQ4E.js";import"./utils-BMtDQ3Mp.js";import"./useObjectRef-C8p51AiY.js";import"./keyboard-uKxI18m4.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./useEvent-gqYo67_a.js";import"./useLabels-DdirUbZa.js";import"./useLocalizedStringFormatter-Dhnzadev.js";import"./I18nProvider-C_4m3VHk.js";import"./useControlledState-C9PUVjXY.js";import"./Button-S9X553hq.js";import"./Label-BVmI6bof.js";import"./Hidden-D546-sk9.js";import"./useLabel-yKsWsykb.js";import"./number-DJMv4vuV.js";import"./useButton-Tyy1zmtL.js";import"./usePress-DMXgY0oY.js";import"./textSelection-8YvAK-Rq.js";import"./useHover-DqXkt4DH.js";import"./getItemCount-B7fxe3k-.js";import"./useCollection-Cs0xDMvq.js";import"./FocusScope-CR9tPNWo.js";import"./Input-0kUbtdsi.js";import"./ListBox-sjCYFeen.js";import"./Text-GoRNm5GP.js";import"./useListState-Gx-EzyDz.js";import"./Dialog-D8aXriuN.js";import"./Heading-DAe5mcha.js";import"./useOverlayTriggerState-AJWVqgd9.js";import"./VisuallyHidden-BwUv9CCW.js";import"./animation-BJNMN6_t.js";import"./SearchField-BuWO_BBj.js";import"./FieldError-TG0Riy-r.js";import"./useFormValidation-BtIFnSNg.js";import"./useTextField-CDL3kK35.js";import"./useField-ET5d43gu.js";import"./useFormReset-DkLfLBli.js";import"./Virtualizer-C2Xneja1.js";import"./useFilter-PzttL9Gi.js";import"./index-B0Q9OrQR.js";import"./getNodeText-CRuIzOmM.js";import"./BUIRoutingProvider-80Q71Qhv.js";import"./useResolvedHref-BnrY4UN4.js";const d=g.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(h,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),o=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})}),m=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}}),u=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
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
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...u.input.parameters?.docs?.source}}};const Me=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,p as Virtualized,u as VirtualizedMaxHeight,Me as __namedExportsOrder};
