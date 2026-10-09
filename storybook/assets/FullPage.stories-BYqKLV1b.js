import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-D_sJ6DQq.js";import{P as l}from"./PluginHeader-PEQPng2R.js";import{C as p}from"./Container-CP6KUZvZ.js";import{T as t}from"./Text-DkYMqMyY.js";import{B as j}from"./BUIProvider-BidkyxVm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BDjCUC6F.js";import"./utils-rcqHDtde.js";import"./useObjectRef-C71_ODYl.js";import"./useCollection-BZrfI6w5.js";import"./useFocusRing-DDwhFymc.js";import"./openLink-DVi3OW0T.js";import"./Hidden-B0JsmZw6.js";import"./keyboard-NWCLTI3I.js";import"./getMetaValue-DT9wVw6b.js";import"./FocusScope-CdP29dN2.js";import"./useEvent-CDKl63CX.js";import"./I18nProvider-Bnu7qnYs.js";import"./usePress-LFrjKvgu.js";import"./textSelection-5Cu1iBDL.js";import"./useControlledState-F0ZESx8Q.js";import"./Link-vIX2Xulc.js";import"./useLink-D4kRl6q0.js";import"./useHover-CC1tHz-Y.js";import"./useLocalizedStringFormatter-C7VBNrzb.js";import"./Button-B76pvApp.js";import"./Label-CqUgdJka.js";import"./useLabel-JU3kQl_C.js";import"./useLabels-CtqB2Ot9.js";import"./number-Dv4CgBIP.js";import"./useButton-BuKBKhUn.js";import"./Menu-Bs2grAf5.js";import"./Autocomplete-eTntpY6G.js";import"./useLoadMoreSentinel-CraZ1CkX.js";import"./Input-DbjRx16d.js";import"./ListBox-Bnw0gD-X.js";import"./SelectionIndicator-BZePfqOL.js";import"./Text-CukGZgZw.js";import"./useListState-BH7RMIgK.js";import"./Dialog-B73dr1WP.js";import"./Heading-B4So50dI.js";import"./useOverlayTriggerState-D-wAUn4a.js";import"./VisuallyHidden-Blk8A0BW.js";import"./animation-uPm_hcT3.js";import"./SearchField-B-14swhZ.js";import"./FieldError-CD2mDzmR.js";import"./Form-BXoeFdX8.js";import"./useFormValidation-CZ1LA-b2.js";import"./useTextField-CCQt5UyT.js";import"./useField-gSzBaL8y.js";import"./useFormReset-DHxzgEZr.js";import"./Virtualizer-CXXYNYy2.js";import"./useFilter-k29km2gM.js";import"./getNodeText-B_78eWdD.js";import"./Link-VILBsUo4.js";import"./useResolvedHref-DjhEn3qh.js";import"./Tooltip-sRD7G72k.js";import"./VisuallyHidden-BXS9EDOE.js";import"./Tabs-evuOJNry.js";import"./useHasTabbableChild-DGrfObyd.js";import"./BUIRoutingProvider-BnYGukOM.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
