import{j as t,W as u,K as p,X as g}from"./iframe-DcD9AGXg.js";import{r as h}from"./plugin-DIVN5QtQ.js";import{S as l,u as c,a as x}from"./useSearchModal-YBjuEhfc.js";import{s as S,M}from"./api-COYEBjeH.js";import{S as C}from"./SearchContext-fl17IBZz.js";import{B as m}from"./Button-BAmJt2KB.js";import{m as f}from"./makeStyles-aq0vcWH5.js";import{D as j,a as y,b as B}from"./DialogTitle-CZP_BRIL.js";import{B as D}from"./Box-CD9U0JkS.js";import{S as n}from"./Grid-Cw-xaTkg.js";import{S as I}from"./SearchType-CAp52eKi.js";import{L as G}from"./List-CLA1LZPX.js";import{H as R}from"./DefaultResultListItem-D-A0sBTB.js";import{w as k}from"./appWrappers-BJDlrPuY.js";import{SearchBar as v}from"./SearchBar-5pJEPeim.js";import{S as T}from"./SearchResult-JNlQsqQH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Y0LMR_Rk.js";import"./Plugin-CvmPtfVU.js";import"./componentData-CtZZUQKV.js";import"./useAnalytics-CfHyGFqG.js";import"./useApp-BGsurTzd.js";import"./useRouteRef-CFkCiaBo.js";import"./index-DPPn6txq.js";import"./ArrowForward-pxelewk9.js";import"./translation-C2sY9N3H.js";import"./Page-BtZMZNWr.js";import"./useMediaQuery-CcaqtSEC.js";import"./Divider-BVfIhr-j.js";import"./ArrowBackIos-yBY8uryl.js";import"./ArrowForwardIos-B7M2FZsF.js";import"./translation-VD-dAcoB.js";import"./lodash-B15ups4d.js";import"./useAsync-BKLC1dsy.js";import"./useMountedState-DObEazil.js";import"./Modal-DTbiCsDk.js";import"./Portal-B5t-TUu9.js";import"./Backdrop-B9geltvz.js";import"./styled-Dv4Z9rlI.js";import"./ExpandMore-C5yZVzxC.js";import"./AccordionDetails-Bf-t1aN1.js";import"./index-B9sM2jn7.js";import"./Collapse-birbGpCt.js";import"./ListItem-wfNPMux6.js";import"./ListContext-Bdpr0ztu.js";import"./ListItemIcon-C28HUugp.js";import"./ListItemText-B4ptHm4S.js";import"./Tabs-Dlp53-k-.js";import"./KeyboardArrowRight-CLtAFZZ8.js";import"./FormLabel-3wwRa_Oz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CeCKp-3j.js";import"./InputLabel-C76jBc4l.js";import"./Select-BZuksx2c.js";import"./Popover-CXmA6qz_.js";import"./MenuItem-vbPvuYDj.js";import"./Checkbox-BDBK1x29.js";import"./SwitchBase-6Y0Q3iC2.js";import"./Chip-Cx84ystz.js";import"./Link-gUNM1rpZ.js";import"./index-V-0l0hfC.js";import"./useObservable-DKaAzEJE.js";import"./useIsomorphicLayoutEffect-DuTkQWBe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Bp3xVPML.js";import"./useDebounce-CXOn7_HY.js";import"./InputAdornment-CF2JNJLc.js";import"./TextField-DxPhynUg.js";import"./useElementFilter-e5oQHJdV.js";import"./EmptyState-CPBKxgpj.js";import"./Progress-Dk6v86Zv.js";import"./LinearProgress-ButoZH13.js";import"./ResponseErrorPanel-CUe2zYqU.js";import"./ErrorPanel-DKBW-e0p.js";import"./WarningPanel-DD_Vegiw.js";import"./MarkdownContent-DkZ_a2pk.js";import"./CodeSnippet-B6Kn_6pI.js";import"./CopyTextButton-Vuxttojt.js";import"./useCopyToClipboard-37bW0I2A.js";import"./Tooltip-CK-bju_x.js";import"./Popper-DI0xczFA.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
