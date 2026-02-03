import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-BRAtl1PG.js";import{r as x}from"./plugin-h9hmJL9Q.js";import{S as l,u as c,a as S}from"./useSearchModal-Dv-Ti4Jo.js";import{s as M,M as C}from"./api-BJrbO_4Y.js";import{S as f}from"./SearchContext-Bc9GPw06.js";import{B as m}from"./Button-BatWjXLp.js";import{D as j,a as y,b as B}from"./DialogTitle-KC0EWpd-.js";import{B as D}from"./Box-D7EfII4J.js";import{S as n}from"./Grid-Cneg6dXd.js";import{S as I}from"./SearchType-BMfFeFEQ.js";import{L as G}from"./List-DW5i0QCT.js";import{H as R}from"./DefaultResultListItem-dQTa8Qjw.js";import{w as k}from"./appWrappers-B2HzzFzx.js";import{SearchBar as v}from"./SearchBar-DcTUDazf.js";import{S as T}from"./SearchResult-FqbAiEhT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BnBNxv4q.js";import"./Plugin-B8o3244Q.js";import"./componentData-jPNeQwLn.js";import"./useAnalytics-DVsybmfh.js";import"./useApp-Gv1SYk8q.js";import"./useRouteRef-D86Ud85d.js";import"./index-UAXk7FN5.js";import"./ArrowForward-Cbg0slKz.js";import"./translation-BT9ICj76.js";import"./Page-D6PshrWD.js";import"./useMediaQuery-COy2-Kh6.js";import"./Divider-BFDiZlO8.js";import"./ArrowBackIos-DWmN6c9K.js";import"./ArrowForwardIos-D83gzila.js";import"./translation-DHFdvUqw.js";import"./lodash-Czox7iJy.js";import"./useAsync-ldnaQaod.js";import"./useMountedState-PBRhdOpD.js";import"./Modal-COPte8PF.js";import"./Portal-CmmcMNPo.js";import"./Backdrop-B3YqXUgb.js";import"./styled-D-CRs93U.js";import"./ExpandMore-DRdYJoQu.js";import"./AccordionDetails-DIaxBLag.js";import"./index-B9sM2jn7.js";import"./Collapse-_zQA2_Pp.js";import"./ListItem-DGTqNMMt.js";import"./ListContext-DnBkigGS.js";import"./ListItemIcon-BPzL8bj_.js";import"./ListItemText-BSrDcH8Z.js";import"./Tabs-C6d6tiqM.js";import"./KeyboardArrowRight-BqKr0k7C.js";import"./FormLabel-CGzxiAxW.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CNgpjCWu.js";import"./InputLabel-DTgVA5Le.js";import"./Select-BZBCfIBX.js";import"./Popover-Da1vwkD2.js";import"./MenuItem-L0xudy8O.js";import"./Checkbox-C7kmZQfP.js";import"./SwitchBase-BwiGo5va.js";import"./Chip-DMqTU7t7.js";import"./Link-BXsEZtUH.js";import"./useObservable-DhHSl2gB.js";import"./useIsomorphicLayoutEffect-DAhw2EJx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C_4siJCp.js";import"./useDebounce-ChO0Rzs0.js";import"./InputAdornment-_xgH01AG.js";import"./TextField-DLCvzqFA.js";import"./useElementFilter-wCIPSn0K.js";import"./EmptyState-B9ELmfIE.js";import"./Progress--kQZrP35.js";import"./LinearProgress-Dj_0snld.js";import"./ResponseErrorPanel-DuOdK0XL.js";import"./ErrorPanel-YK6XTPJI.js";import"./WarningPanel-Dgi0x69_.js";import"./MarkdownContent-BIfRKm7t.js";import"./CodeSnippet-BYUXS9v0.js";import"./CopyTextButton-BPfRPWdE.js";import"./useCopyToClipboard-BuklA7P5.js";import"./Tooltip-CPq4vOtC.js";import"./Popper-b-3H8dnH.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
