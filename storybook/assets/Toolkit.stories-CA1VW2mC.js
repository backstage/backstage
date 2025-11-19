import{j as o}from"./iframe-C4dPZ8kl.js";import{c as e}from"./plugin-DyYk1xMB.js";import{S as l}from"./Grid-CZkThu2A.js";import{C as m}from"./ComponentAccordion-XBHCPqkg.js";import{w as a}from"./appWrappers-7vg0hiAv.js";import{T as i}from"./TemplateBackstageLogoIcon-Bwt3-Idv.js";import{I as s}from"./InfoCard-fptdlUM7.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CK7oqw3K.js";import"./componentData-DMZccOUa.js";import"./useAnalytics-DSRHfRk8.js";import"./useApp-DcP6b98f.js";import"./useRouteRef-BQcipW1o.js";import"./index-D_dzg66M.js";import"./DialogTitle-B_WNMW88.js";import"./Modal-Ch6lvVax.js";import"./Portal-C3KrmcYH.js";import"./Backdrop-CYIUSPea.js";import"./Button-Bagr9kg6.js";import"./useObservable-ucvHRIwK.js";import"./useIsomorphicLayoutEffect-DxvvdXSg.js";import"./ExpandMore-DDjBqXKI.js";import"./AccordionDetails-Ce7Lmoz_.js";import"./index-DnL3XN75.js";import"./Collapse-CJN8yhuQ.js";import"./useAsync-DoJxcUlb.js";import"./useMountedState-Cn7zfAE-.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BvLIKHM3.js";import"./ErrorBoundary-CbSR2es8.js";import"./ErrorPanel-f98hRRjB.js";import"./WarningPanel-UrVVQWJv.js";import"./MarkdownContent-DRc5DkYJ.js";import"./CodeSnippet-B1XiwaHz.js";import"./Box-COTlPoNf.js";import"./styled-ie_8oXYP.js";import"./CopyTextButton-ENp4DaQL.js";import"./useCopyToClipboard-CFD3RXQw.js";import"./Tooltip-BFnVM2Xk.js";import"./Popper-0_gUpV4D.js";import"./List-CsFCwjIb.js";import"./ListContext-CZ3AIdLK.js";import"./ListItem-Bx6LKxKb.js";import"./ListItemText-BtakqwiJ.js";import"./LinkButton-DQDnYx_t.js";import"./Link-qsu39Qum.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-dQebxsoQ.js";import"./Divider-BRNaSJ60.js";import"./CardActions-CqEpFnAU.js";import"./BottomLink-CPG2W-HG.js";import"./ArrowForward-nOblFUSu.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
