import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-DgMUslzK.js";import{P as l}from"./PluginHeader-92ES52Ym.js";import{C as p}from"./Container-GXU9F3vx.js";import{T as t}from"./Text-BSs-z84W.js";import{B as j}from"./BUIProvider-GUdtKeqf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CQmiOcmz.js";import"./utils-DhxbSGHl.js";import"./useObjectRef-XeGD6VQX.js";import"./useCollection-B9NlIeHS.js";import"./useFocusRing-B4qSrPyS.js";import"./openLink-CV_TcEkD.js";import"./Hidden-BAVkFQWw.js";import"./keyboard-QF3EkhTC.js";import"./FocusScope-oWwmvnZH.js";import"./useEvent-CJepjbxE.js";import"./I18nProvider-CGCG23Ya.js";import"./usePress-CnualNnF.js";import"./textSelection-XO3NdvnZ.js";import"./useControlledState-BXceL1Ef.js";import"./Link-DIWsG8dx.js";import"./useLink-BAcQ0Kqj.js";import"./useHover-D4699e1A.js";import"./useLocalizedStringFormatter-2Z2O1PD_.js";import"./Button-Ce1GzKNk.js";import"./Label-RJPM6nLR.js";import"./useLabel-Cp4A-_gp.js";import"./useLabels-B0EqUNWZ.js";import"./number-BYuAoFwI.js";import"./useButton-DTMzfS5e.js";import"./Menu-B0N_k_Rh.js";import"./Autocomplete-k4dn0hvl.js";import"./getItemCount-C1XLtSGc.js";import"./Input-BwG4UZpQ.js";import"./ListBox-DiQH_mCN.js";import"./Text-DpEEeOvr.js";import"./useListState-CpxqJimO.js";import"./Dialog-IOmluWim.js";import"./Heading-BtuAv-cb.js";import"./useOverlayTriggerState-BQASwI2b.js";import"./VisuallyHidden-CvVmRX3H.js";import"./animation-CkKjJK8U.js";import"./SearchField-CmqAR_hy.js";import"./FieldError-D_Mr9T0S.js";import"./useFormValidation-DdO1uBuo.js";import"./useTextField-DhT4aJpW.js";import"./useField-DvMrjFac.js";import"./useFormReset-CJ2gFrM1.js";import"./Virtualizer-BNjAdMOc.js";import"./useFilter-5AYIsKvl.js";import"./getNodeText-BO0l2uWS.js";import"./Link-CNIArFp6.js";import"./useResolvedHref-BodXPRI9.js";import"./Tooltip-BLYW7H2X.js";import"./VisuallyHidden-DMVkb-ZN.js";import"./Tabs-BJn2fa9q.js";import"./useHasTabbableChild-5-2uXc7N.js";import"./BUIRoutingProvider-BC2UkotL.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
