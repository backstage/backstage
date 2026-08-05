import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-BSg6SOip.js";import{P as l}from"./PluginHeader-B6udpcbH.js";import{C as p}from"./Container-BWE3mk_r.js";import{T as t}from"./Text-BUrmjhwZ.js";import{B as j}from"./BUIProvider-DGOt-Xmy.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dlj3HaWF.js";import"./utils-DeLUZGx2.js";import"./useObjectRef-DBlAjOUP.js";import"./useCollection-DvHDK50b.js";import"./useFocusRing-DGKZUDqT.js";import"./openLink-DxYjWf7G.js";import"./Hidden-4PpluWSp.js";import"./keyboard-CsWowfPP.js";import"./FocusScope-Cokg97zJ.js";import"./useEvent-wFo09GKu.js";import"./I18nProvider-C5Ed87oL.js";import"./usePress-DhUqF1zw.js";import"./textSelection-aDFvxn9c.js";import"./useControlledState-CaozfHK9.js";import"./Link-B-1gThbt.js";import"./useLink-BXx0MEjr.js";import"./useHover-BKKglU9f.js";import"./useLocalizedStringFormatter-3P7dKLk3.js";import"./Button-OzTainv7.js";import"./Label-Bsgi-8sx.js";import"./useLabel-xLEOMe10.js";import"./useLabels-C_VR0tdY.js";import"./number-iU0vIrtR.js";import"./useButton-BIeTy3DX.js";import"./Menu-L20_sRcG.js";import"./Autocomplete-CnJA6POS.js";import"./getItemCount-DKo1Nidv.js";import"./Input-DH05hXmi.js";import"./ListBox-VuPp4ZDp.js";import"./Text-sM1EKRDW.js";import"./useListState-CTPsqM3T.js";import"./Dialog-g4w5QBOm.js";import"./Heading-CRk9HMj5.js";import"./useOverlayTriggerState-BjxIi2GR.js";import"./VisuallyHidden-NMydw6nU.js";import"./animation-C65meOdJ.js";import"./SearchField-BDXMhnez.js";import"./FieldError-BlC4M7Iq.js";import"./useFormValidation-ChfEGaAs.js";import"./useTextField-unZ9EnYz.js";import"./useField-CXk8tlI8.js";import"./useFormReset-D0dwzMqm.js";import"./Virtualizer-BuUh5RvF.js";import"./useFilter-DzFFH65V.js";import"./getNodeText-cZzvp9la.js";import"./Link-CU8rIc5m.js";import"./useResolvedHref-qBxDchOt.js";import"./Tooltip-YKPXWgKl.js";import"./VisuallyHidden-DBJGIqj2.js";import"./Tabs-CMm7XmoF.js";import"./useHasTabbableChild-D2AyRjoL.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
