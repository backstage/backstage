import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-DmKIhSd4.js";import{P as l}from"./PluginHeader-4TwgL8_I.js";import{C as p}from"./Container-mSGZ2u0b.js";import{T as t}from"./Text-BicYU9XU.js";import{B as j}from"./BUIProvider-8kFB0Ao9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BPEgRMek.js";import"./utils-Bp1UFdf_.js";import"./useObjectRef-DibnPYi9.js";import"./useCollection-DMTpsXv-.js";import"./useFocusRing-DrLz8-Tu.js";import"./openLink-Zk6hhSyn.js";import"./Hidden-B2CHbqyo.js";import"./keyboard-Ds5EVepz.js";import"./FocusScope-CTFUQOY7.js";import"./useEvent-CsZ4P3K8.js";import"./I18nProvider-BA08ZmK6.js";import"./usePress-DvOXzaHx.js";import"./textSelection-DOq0Tvnx.js";import"./useControlledState-OVmM0QOa.js";import"./Link-D3Yf34lr.js";import"./useLink-BEUc_BxG.js";import"./useHover-CwSUiPfU.js";import"./useLocalizedStringFormatter-D0LOo8fp.js";import"./Button--V2N_X5K.js";import"./Label-C46amIDy.js";import"./useLabel-BhsNw667.js";import"./useLabels-B-OZcbcW.js";import"./number-8YiafpBN.js";import"./useButton-DGptM25J.js";import"./Menu-CTLsA47H.js";import"./Autocomplete-C5Sghm7K.js";import"./getItemCount-D3bHvsi2.js";import"./Input-DtmKW4qJ.js";import"./ListBox-53KT6IV9.js";import"./Text-Byu4ntdl.js";import"./useListState-Dq51oWO1.js";import"./Dialog-kkWq3T68.js";import"./Heading-D6VX8i-P.js";import"./useOverlayTriggerState-B-0MWh2c.js";import"./VisuallyHidden-BG0wcyw6.js";import"./animation-i-bGx-PV.js";import"./SearchField-BX4zF7Cd.js";import"./FieldError-CirVGv2n.js";import"./useFormValidation-Cc5Povv1.js";import"./useTextField-4a3KQF0X.js";import"./useField-CxXZZEuS.js";import"./useFormReset-DQqa-4LG.js";import"./Virtualizer-BYoDysDq.js";import"./useFilter-CMg65DGm.js";import"./getNodeText-CQ1DPIaE.js";import"./Link-AsYmn9qB.js";import"./useResolvedHref-XzxGpNLx.js";import"./Tooltip-BqIA_Hyn.js";import"./VisuallyHidden-xpEM0plp.js";import"./Tabs-RaaoKpW_.js";import"./useHasTabbableChild-S8Tdm7Qn.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
