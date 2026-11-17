import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-BS0xFXlr.js";import{T as y}from"./TestRouter-DiVja1l4.js";import{P as l}from"./PluginHeader-CuojX332.js";import{C as p}from"./Container-4ufsPE3N.js";import{T as t}from"./Text-JYn98pBE.js";import{B as j}from"./BUIProvider-DQGs-4H3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BJ65rCJn.js";import"./index-DiKBASFX.js";import"./utils-Cm8LN8Qs.js";import"./useObjectRef-DUcg5Ry6.js";import"./useCollection-CRcYPZw_.js";import"./useFocusRing-DN0Vfw2w.js";import"./Hidden-B4kfQ2c4.js";import"./keyboard-0e26zbuq.js";import"./getMetaValue-gNZTl7Dq.js";import"./FocusScope-C2moZHGE.js";import"./useEvent-C9_3kZDD.js";import"./I18nProvider-PG7J6CX1.js";import"./usePress-DqAt-yTJ.js";import"./textSelection-CBFVLC_r.js";import"./useControlledState--_QEZGZM.js";import"./Link-CISEVHYf.js";import"./useLink-DehJ0YMq.js";import"./useHover-CBc8HZSH.js";import"./useLocalizedStringFormatter-C0vYX1Z5.js";import"./Button-CEQzuGsm.js";import"./Label-CYKe4XnV.js";import"./useLabel-BuvGyTAc.js";import"./useLabels-BEdhgbVu.js";import"./number-BpBkSV7H.js";import"./useButton-AcAPGB9_.js";import"./Menu-BwFXT8EY.js";import"./Autocomplete-w_NQzNO7.js";import"./useLoadMoreSentinel-CIdmQleI.js";import"./Input-C98m36Qq.js";import"./ListBox-DW717lvJ.js";import"./SelectionIndicator-Br_IDV3_.js";import"./Text-CuDGkaxu.js";import"./useListState-DFZV_VbF.js";import"./Dialog-BRsdJ6DX.js";import"./Heading-BiP5nQgc.js";import"./useOverlayTriggerState-BmqdnQuv.js";import"./VisuallyHidden-CTRcAVBz.js";import"./animation-C8VQ-2r7.js";import"./SearchField-CNkog-IN.js";import"./FieldError-B0W-gOBy.js";import"./Form-Dzkw_-wT.js";import"./useFormValidation-BzvYcKAP.js";import"./useTextField-QI3hhjLQ.js";import"./useField-D-T_edQG.js";import"./useFormReset-C6LGHf4l.js";import"./Virtualizer-DprK8sB6.js";import"./useFilter-XqScphGR.js";import"./getNodeText-BkgZ_pUi.js";import"./BUIRoutingProvider-DEeoTJxk.js";import"./Link-Co1qyAvC.js";import"./Tooltip-BKQmVUTS.js";import"./VisuallyHidden-DOwLUvg4.js";import"./Tabs-1sbItyxN.js";import"./useHasTabbableChild-Cfu36tt9.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
