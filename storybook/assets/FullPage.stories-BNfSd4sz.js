import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-Czj8FpnD.js";import{T as y}from"./TestRouter-CX-tTgqL.js";import{P as l}from"./PluginHeader-7ctMTX5a.js";import{C as p}from"./Container-QwS-JxnD.js";import{T as t}from"./Text-7TRQ-xvv.js";import{B as j}from"./BUIProvider-OJJxz-jo.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BCJhT9-Z.js";import"./index-BCAPzNLa.js";import"./utils-Cs3-rVue.js";import"./useObjectRef-CyY6Q9V8.js";import"./useCollection-ChjTTmHK.js";import"./useFocusRing-CwUtzNaZ.js";import"./Hidden-D92ts2Xi.js";import"./keyboard-c2N8M041.js";import"./getMetaValue-DkJYbvS7.js";import"./FocusScope-DZbcaNEi.js";import"./useEvent-CErUhJ3S.js";import"./I18nProvider-DcvSd-3L.js";import"./usePress-BgiTNIgt.js";import"./textSelection-YqIZsSWD.js";import"./useControlledState-BUpBSTwT.js";import"./Link-CqiOBVX1.js";import"./useLink-Dz9TmbWJ.js";import"./useHover-DmfU1sNI.js";import"./useLocalizedStringFormatter-C-EjHsV9.js";import"./Button-WAnZG6Vk.js";import"./Label-Blh7v6VS.js";import"./useLabel-v9mJauUl.js";import"./useLabels-CAcUUNYA.js";import"./number-BSntpDAw.js";import"./useButton-DuqPYhB5.js";import"./Menu-DZozeF3w.js";import"./Autocomplete-BDXH7E14.js";import"./useLoadMoreSentinel-C2YCAk4l.js";import"./Input-CYxhsLNI.js";import"./ListBox-L2Ctf3fb.js";import"./SelectionIndicator-Ckw1-Jgz.js";import"./Text-BOev6yT9.js";import"./useListState-BFfb8iUr.js";import"./Dialog-BeTbgKAz.js";import"./Heading-BqkG8VAl.js";import"./useOverlayTriggerState-2rMwEAbI.js";import"./VisuallyHidden-C9MwevTz.js";import"./animation-DTzXe6sA.js";import"./SearchField-Bm7qhkOO.js";import"./FieldError-602GnWts.js";import"./Form-CftNTrRl.js";import"./useFormValidation-D1qrE1xb.js";import"./useTextField-B2QbAykk.js";import"./useField-C3mbQURX.js";import"./useFormReset-DoJay8y7.js";import"./Virtualizer-6VjAqnGy.js";import"./useFilter-6oERmyxI.js";import"./getNodeText-Dfn-ECTs.js";import"./BUIRoutingProvider-BITBZMZ0.js";import"./Link-C4xA7lbP.js";import"./Tooltip-ClVCahfe.js";import"./VisuallyHidden-k-Ak8N0h.js";import"./Tabs-D7o0amoa.js";import"./useHasTabbableChild-PO5AicTG.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
