import{j as o}from"./iframe-QksS9oll.js";import{c as e}from"./plugin-cime2aoh.js";import{S as l}from"./Grid-D7XFfWKi.js";import{C as m}from"./ComponentAccordion-Blg4rrEO.js";import{w as a}from"./appWrappers-Cbugcrv7.js";import{T as i}from"./TemplateBackstageLogoIcon-B4Sq2VtL.js";import{I as s}from"./InfoCard-BwrMRdCa.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-TdwU8h6j.js";import"./componentData-CRWc3Ue1.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./useRouteRef-CZboVwVy.js";import"./index-esiVI4gD.js";import"./DialogTitle-CMD6ovcq.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./Backdrop-D-shBcLD.js";import"./Button-Dfimf7ZU.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./ExpandMore-BvW0rUjO.js";import"./AccordionDetails-DsDHdK5k.js";import"./index-B9sM2jn7.js";import"./Collapse-BhNoWWNo.js";import"./useAsync-DdMXChPX.js";import"./useMountedState-DqrcsGZ8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-B-_Sxb8f.js";import"./ErrorBoundary-DXuXgUlr.js";import"./ErrorPanel-_1DH6jIy.js";import"./WarningPanel-D9lI_etd.js";import"./MarkdownContent-D_MwY5Q0.js";import"./CodeSnippet-NS8GLkfk.js";import"./Box-4mwxRbT8.js";import"./styled-Dz3wLS-L.js";import"./CopyTextButton-CkYKd75j.js";import"./useCopyToClipboard-B1WVdUm6.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./ListItem-CjzOJyc8.js";import"./ListItemText-DdfK1hjm.js";import"./LinkButton-DzZbKr17.js";import"./Link-vv3H9C9T.js";import"./lodash-Czox7iJy.js";import"./CardHeader-B0eVnrW4.js";import"./Divider-C2MLF46q.js";import"./CardActions-DAsWgPAr.js";import"./BottomLink-8s-33zJ-.js";import"./ArrowForward-DFKd6RHK.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
