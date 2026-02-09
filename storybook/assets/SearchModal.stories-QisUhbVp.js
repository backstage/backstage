import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-BNPQer77.js";import{r as x}from"./plugin-BY_h4Yx5.js";import{S as l,u as c,a as S}from"./useSearchModal-CNkeZ5Ar.js";import{s as M,M as C}from"./api-DjQ3qFVy.js";import{S as f}from"./SearchContext-CPqnqvun.js";import{B as m}from"./Button-DSVLq8Gc.js";import{D as j,a as y,b as B}from"./DialogTitle-BazRkn4Q.js";import{B as D}from"./Box-C3TqwX1t.js";import{S as n}from"./Grid-Yv5UUmOJ.js";import{S as I}from"./SearchType-J3lusORD.js";import{L as G}from"./List-Bj78s_pe.js";import{H as R}from"./DefaultResultListItem-Dw1vCA84.js";import{w as k}from"./appWrappers-DclPpZoE.js";import{SearchBar as v}from"./SearchBar-Ds8i7znb.js";import{S as T}from"./SearchResult-DEDPYb0g.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D2GETPep.js";import"./Plugin-oKbni2qq.js";import"./componentData-CJSyf2UH.js";import"./useAnalytics-DI9G1xrU.js";import"./useApp-C940MqwE.js";import"./useRouteRef-B6URd4oF.js";import"./index-D2A2K7dC.js";import"./ArrowForward-DRg3cXaR.js";import"./translation-CGRc-O1N.js";import"./Page-Bmpqs4D6.js";import"./useMediaQuery-B3PljuEy.js";import"./Divider-B0I47vSC.js";import"./ArrowBackIos-B_MoNXbP.js";import"./ArrowForwardIos-D_wSMwLP.js";import"./translation-Dx1K0MZ6.js";import"./lodash-D6Y5cDVN.js";import"./useAsync-D-OdF4D0.js";import"./useMountedState-Zh225SSx.js";import"./Modal-DuAz145P.js";import"./Portal-D6rxE-he.js";import"./Backdrop-_FdCAelp.js";import"./styled-T_nlQOJW.js";import"./ExpandMore-DnsJ2ZcH.js";import"./AccordionDetails-D3zUb3eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-CiSJJETO.js";import"./ListItem-we3G7HGD.js";import"./ListContext-BZ4pbeSM.js";import"./ListItemIcon-HoZCsTUz.js";import"./ListItemText-BhKqNs_V.js";import"./Tabs-Bq8D1WAr.js";import"./KeyboardArrowRight-Dyp8kiKO.js";import"./FormLabel-3F1wLsZS.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-u4c6bt7d.js";import"./InputLabel-DKEgz18B.js";import"./Select-BKv9FlUU.js";import"./Popover-DhB4mRyc.js";import"./MenuItem-BYzxdblD.js";import"./Checkbox-CS_vqoL6.js";import"./SwitchBase-BIewZ4ND.js";import"./Chip-BKjFTYWx.js";import"./Link-B__iWKUx.js";import"./useObservable-CdBXE0_V.js";import"./useIsomorphicLayoutEffect-Dmyd5J3v.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BQAQXg6u.js";import"./useDebounce-DNfMe9na.js";import"./InputAdornment-BoBvoooI.js";import"./TextField-BkuAEY9z.js";import"./useElementFilter-Cndvdkm8.js";import"./EmptyState-B1c-BWy4.js";import"./Progress-BtKp9wee.js";import"./LinearProgress-DsYQby8O.js";import"./ResponseErrorPanel-C0BLPT9o.js";import"./ErrorPanel-DtcOFy2G.js";import"./WarningPanel-BL8AsDrP.js";import"./MarkdownContent-BjXL71oS.js";import"./CodeSnippet-cVxXfk04.js";import"./CopyTextButton-CEvihpza.js";import"./useCopyToClipboard-w_54iq4h.js";import"./Tooltip-ZVPmh-dx.js";import"./Popper-BItIL40F.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
