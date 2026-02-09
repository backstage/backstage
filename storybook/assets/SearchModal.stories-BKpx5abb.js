import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CZ56O-V9.js";import{r as x}from"./plugin-BUPH-RXF.js";import{S as l,u as c,a as S}from"./useSearchModal-DkUD5yfc.js";import{s as M,M as C}from"./api-C0b41NLl.js";import{S as f}from"./SearchContext-kWgyC5N7.js";import{B as m}from"./Button-DKgYvdYh.js";import{D as j,a as y,b as B}from"./DialogTitle-C-1j8eOs.js";import{B as D}from"./Box-MN-uZs4I.js";import{S as n}from"./Grid-DjbHNKXL.js";import{S as I}from"./SearchType-BMv_bt-g.js";import{L as G}from"./List-DEdaJe5c.js";import{H as R}from"./DefaultResultListItem-4nmu660v.js";import{w as k}from"./appWrappers-BeJ0xyiP.js";import{SearchBar as v}from"./SearchBar-CTuWR_Xi.js";import{S as T}from"./SearchResult-0Gf_BciX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-EaCOp69p.js";import"./Plugin-DZUy8-Yb.js";import"./componentData-CSZ8ujY9.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./useRouteRef-CcFxojYp.js";import"./index-Ca3h4iDJ.js";import"./ArrowForward-CzbSCcaK.js";import"./translation-Bt42sXmg.js";import"./Page-Bc5nNmPG.js";import"./useMediaQuery-BZs__Am8.js";import"./Divider-C407Z4rN.js";import"./ArrowBackIos-DZHRGwJ_.js";import"./ArrowForwardIos-C_xPu41k.js";import"./translation-zX5vBj7y.js";import"./lodash-Czox7iJy.js";import"./useAsync-BZsMG4pg.js";import"./useMountedState-ut5gwY4t.js";import"./Modal-CQLQBAd-.js";import"./Portal-rgcloK6u.js";import"./Backdrop-DdZZM_yb.js";import"./styled-D9whByUF.js";import"./ExpandMore-yvURIOcL.js";import"./AccordionDetails-BaPE-Me3.js";import"./index-B9sM2jn7.js";import"./Collapse-DPNvm9kr.js";import"./ListItem-BtvfynNb.js";import"./ListContext-BmrJCIpO.js";import"./ListItemIcon-B1QkhF77.js";import"./ListItemText-Dn38yijY.js";import"./Tabs-CDoCvSMt.js";import"./KeyboardArrowRight-1NRWTCet.js";import"./FormLabel-BAfE8vI7.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DbdKJwgf.js";import"./InputLabel-BKt55Sxd.js";import"./Select-CvcKmOJe.js";import"./Popover-hzCM8euj.js";import"./MenuItem-0ISkGz6r.js";import"./Checkbox-CcaK8VHq.js";import"./SwitchBase-DAeiXm-p.js";import"./Chip-Xjm0jvfX.js";import"./Link-BQF_zimC.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B_qxbQMz.js";import"./useDebounce-CMPLkYhG.js";import"./InputAdornment-Dc_66_FV.js";import"./TextField-DH-_gpSM.js";import"./useElementFilter-DsgRz-ny.js";import"./EmptyState-C0lKoeTI.js";import"./Progress-Du9yI75y.js";import"./LinearProgress-DvsI2E8u.js";import"./ResponseErrorPanel-DijxxXkN.js";import"./ErrorPanel-CQnJnEL8.js";import"./WarningPanel-CChAptH0.js";import"./MarkdownContent-BOJKT2W9.js";import"./CodeSnippet-rkZMP_wC.js";import"./CopyTextButton-wUac2sWa.js";import"./useCopyToClipboard-CrTqHNaz.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
