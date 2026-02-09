import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-Cih9KYts.js";import{s as g,H as u}from"./plugin-AlTbBZ5j.js";import{c as h}from"./api-BjPxMDDu.js";import{c as f}from"./catalogApiMock-A_oRiiPo.js";import{s as x}from"./api-C9Cc-uCq.js";import{S as y}from"./SearchContext-DIcRkiWA.js";import{P as S}from"./Page-CUb5oXw7.js";import{S as r}from"./Grid-CLRvRbDN.js";import{b as k,a as j,c as C}from"./plugin-3Q6LhQe7.js";import{T as P}from"./TemplateBackstageLogo-BwZV4v6f.js";import{T as I}from"./TemplateBackstageLogoIcon-JUYcJeEX.js";import{e as T}from"./routes-Bm_ATbEb.js";import{w as v}from"./appWrappers-C7AQtpTy.js";import{s as G}from"./StarredEntitiesApi-Cjd_KRl3.js";import{M as A}from"./MockStarredEntitiesApi-DSVN7IWQ.js";import{I as B}from"./InfoCard-BJ74Wy1V.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CmBl_uuR.js";import"./Plugin-C_qaKzy-.js";import"./componentData-DlgYE3l_.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./useRouteRef-DDi4DkR7.js";import"./index-Bp0jFuCJ.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-DPHt3xdh.js";import"./useMountedState-BYMagqon.js";import"./DialogTitle-CuYpVqTb.js";import"./Modal-BZoQWh9B.js";import"./Portal-DG1SCA6E.js";import"./Backdrop-DyvTB40d.js";import"./Button-CKd96K2t.js";import"./useObservable-BtgVS7-k.js";import"./useIsomorphicLayoutEffect-dPDL8wRM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BSBI4Wy_.js";import"./ErrorBoundary-k6DARfl7.js";import"./ErrorPanel-DT8LzRfG.js";import"./WarningPanel-Cevqk5r0.js";import"./ExpandMore-Dc1qa72P.js";import"./AccordionDetails-CzBbo4eK.js";import"./index-B9sM2jn7.js";import"./Collapse-B12c-Txj.js";import"./MarkdownContent-DcL7o88V.js";import"./CodeSnippet-vQgCgAWU.js";import"./Box-5LOyitj9.js";import"./styled-VBtFtbNj.js";import"./CopyTextButton-CcbF4huw.js";import"./useCopyToClipboard-7I7t0jup.js";import"./Tooltip-CgFVFwTk.js";import"./Popper-D0FUS77U.js";import"./List-DfB6hke5.js";import"./ListContext-DH23_8Wk.js";import"./ListItem-D5wUjexN.js";import"./ListItemText-jFKdxWsL.js";import"./LinkButton-CWYcR8SV.js";import"./Link-Ds2c62Jm.js";import"./CardHeader-CcUDO6MN.js";import"./Divider-BNkMSFIU.js";import"./CardActions-BWT2Xrl1.js";import"./BottomLink-o8fjmmLZ.js";import"./ArrowForward-Br-ribbp.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
