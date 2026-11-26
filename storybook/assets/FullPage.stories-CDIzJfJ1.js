import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-CR1Jw9dV.js";import{T as y}from"./TestRouter-Dpg55vp7.js";import{P as l}from"./PluginHeader-z1afn725.js";import{C as p}from"./Container-C_CpRit7.js";import{T as t}from"./Text-CKKX0sl4.js";import{B as j}from"./BUIProvider-8s_p7rUM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BBOHwEhV.js";import"./index-CHKdAyZ9.js";import"./utils-f1XPU8sj.js";import"./useObjectRef-CxAJnmky.js";import"./useCollection-B_pZRIWT.js";import"./useFocusRing-CCR0Dk_B.js";import"./Hidden-B3uAAl_R.js";import"./keyboard-DwLZW9jg.js";import"./getMetaValue-QyE7lEVK.js";import"./FocusScope-BEubVjvS.js";import"./useEvent-Dm-E9hNt.js";import"./I18nProvider-CXlyEy0i.js";import"./usePress-BO_FqSCY.js";import"./textSelection-DRBuEoQO.js";import"./useControlledState-BQLBMnzZ.js";import"./Link-B2_hRMzT.js";import"./useLink-C4pzvK3e.js";import"./useHover-COtbARlD.js";import"./useLocalizedStringFormatter-C4g2OxQ5.js";import"./Button-DzhTBfgP.js";import"./Label-C37_b03j.js";import"./useLabel-B8RNTxDr.js";import"./useLabels-C65kEDvg.js";import"./number-CXcznxJS.js";import"./useButton-HAI6nP2s.js";import"./Menu-BMyypG8V.js";import"./Autocomplete-B2_gIgbH.js";import"./useLoadMoreSentinel-CpKLnC9F.js";import"./Input-CPFU7dv3.js";import"./ListBox-Ch73kLxF.js";import"./SelectionIndicator-CwTfXNxW.js";import"./Text-BX3OTawI.js";import"./useListState-ZYihbrKT.js";import"./Dialog-BqIzS5Wf.js";import"./Heading-CQY9eX9y.js";import"./useOverlayTriggerState-BrayxibY.js";import"./VisuallyHidden-DyHRdEeF.js";import"./animation-reWawdWv.js";import"./SearchField-BOktDJgN.js";import"./FieldError-xrm2enzG.js";import"./Form-CirHk10M.js";import"./useFormValidation-rdS9Nj4h.js";import"./useTextField-CzwueCey.js";import"./useField-Cc85Nw2S.js";import"./useFormReset-DTZFkvsG.js";import"./Virtualizer-Cg4HTldo.js";import"./useFilter-Cbln8Yhz.js";import"./getNodeText-gWLrG5Ip.js";import"./BUIRoutingProvider-D2NI50xw.js";import"./Link-HttFNMnE.js";import"./Tooltip-Cf2zXoVS.js";import"./VisuallyHidden-XEmogOaE.js";import"./Tabs-BvurC1-b.js";import"./useHasTabbableChild-DFrCo17f.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
