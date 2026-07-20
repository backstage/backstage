import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-e_Pbc_6f.js";import{P as l}from"./PluginHeader-Dheqh1k7.js";import{C as p}from"./Container-BKD4-ixU.js";import{T as t}from"./Text-uEMQqrD_.js";import{B as j}from"./BUIProvider-YvBoGo4d.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D1GUm7TG.js";import"./utils-DxA9yzz1.js";import"./useObjectRef-DrJIir3F.js";import"./useCollection-D77l3K3S.js";import"./useFocusRing-KWUxPK8x.js";import"./openLink-DeVBsZVT.js";import"./Hidden-C1Rvfh0a.js";import"./keyboard-8KwQEgaY.js";import"./FocusScope-DyJjlp03.js";import"./useEvent-CdwABQDt.js";import"./I18nProvider-CEYf4yN0.js";import"./usePress-DUFujYJV.js";import"./textSelection-CmT3bbJB.js";import"./useControlledState-DA3BLMuY.js";import"./Link-7UMdgDHJ.js";import"./useLink-C3g6zDAO.js";import"./useHover-C40GJDws.js";import"./useLocalizedStringFormatter-DiezMxYB.js";import"./Button-D1InRcXf.js";import"./Label-C-UeOlhu.js";import"./useLabel-DuGYdeVZ.js";import"./useLabels-C5Sb3eQn.js";import"./number-CnABZTeS.js";import"./useButton-B-tc2orz.js";import"./Menu-tK0eMXg7.js";import"./Autocomplete-FbP99aZV.js";import"./getItemCount-D4KD3X2x.js";import"./Input-D0qkWHrE.js";import"./ListBox-BqHkkENg.js";import"./Text-kgP67g1L.js";import"./useListState-CPlAgzVx.js";import"./Dialog-C-xzIvD4.js";import"./Heading-Boz8J-3b.js";import"./useOverlayTriggerState-CP5VgdLu.js";import"./VisuallyHidden-Cf_DEQs1.js";import"./animation-yDPRJL1t.js";import"./SearchField--zMKMabY.js";import"./FieldError-R8gf8j-5.js";import"./useFormValidation-Dq2pDWRi.js";import"./useTextField-BeKMltDD.js";import"./useField-BxXW_0MU.js";import"./useFormReset-BF8qzp5Y.js";import"./Virtualizer-gBMOw2Uc.js";import"./useFilter-CUNITVuy.js";import"./getNodeText-Clib3ygy.js";import"./Link-BAgUrxJs.js";import"./useResolvedHref-6YPNP1wf.js";import"./Tooltip-BvBLCeHz.js";import"./VisuallyHidden-ChlmTVpq.js";import"./Tabs-BgFpNnjj.js";import"./useHasTabbableChild-BezigKkY.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
