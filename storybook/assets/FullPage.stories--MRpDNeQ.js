import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-BKMB85pu.js";import{T as y}from"./TestRouter-6Wo-4mB3.js";import{P as l}from"./PluginHeader-DiTI0UNr.js";import{C as p}from"./Container-B3frf28H.js";import{T as t}from"./Text-HfhzKVIY.js";import{B as j}from"./BUIProvider-DtnM-lk2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DT_vTdsS.js";import"./index-CSiDGQP5.js";import"./utils-Nyu7VTFu.js";import"./useObjectRef-CqnWYM4T.js";import"./useCollection-DCkpMumb.js";import"./useFocusRing-jnagQyYL.js";import"./Hidden-DHN5dLew.js";import"./keyboard-D8lqn657.js";import"./getMetaValue-TGQihhTK.js";import"./FocusScope-BD1DX3z1.js";import"./useEvent-BEstD6-f.js";import"./I18nProvider-29Kr0hRB.js";import"./usePress-BpVHvCO3.js";import"./textSelection-Cj_b9rbF.js";import"./useControlledState-D3rG0KvC.js";import"./Link-CuRRMqIi.js";import"./useLink-DY2Gm7C6.js";import"./useHover-BaAG1-q2.js";import"./useLocalizedStringFormatter-ZPcyGWMD.js";import"./Button-BvAYTrV8.js";import"./Label-Y7OAC7uK.js";import"./useLabel-CeJz4BMW.js";import"./useLabels-CFKWkPDt.js";import"./number-CuQ36X_j.js";import"./useButton-BR5xtNl4.js";import"./Menu-CvUIMN8s.js";import"./Autocomplete-BlDpM6qn.js";import"./useLoadMoreSentinel-fdP4gNAl.js";import"./Input-wf8wPR2b.js";import"./ListBox-CW795u3y.js";import"./SelectionIndicator-DQYlZ420.js";import"./Text-Dg9dYh63.js";import"./useListState-Dn5rbzz7.js";import"./Dialog-DEfmHw7Y.js";import"./Heading-b3FFWJ0-.js";import"./useOverlayTriggerState-BIOnmv4V.js";import"./VisuallyHidden-DlBkD_uH.js";import"./animation-R0urY-IW.js";import"./SearchField-Dm1ghHg9.js";import"./FieldError-DJK2D3AO.js";import"./Form-BffRYw_3.js";import"./useFormValidation-B-ExQgbu.js";import"./useTextField-CKOhWsDF.js";import"./useField-D3sSVYZC.js";import"./useFormReset-CvckHHjx.js";import"./Virtualizer-BIlzXxWb.js";import"./useFilter-DkO-TdTR.js";import"./getNodeText-C2sxHK1s.js";import"./BUIRoutingProvider-AZNaPzeL.js";import"./Link-Ci5rjCg4.js";import"./Tooltip-BemYkD6q.js";import"./VisuallyHidden-ButPoUZT.js";import"./Tabs-CZ38Bj1U.js";import"./useHasTabbableChild-BfhzELcH.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
