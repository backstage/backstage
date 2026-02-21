import{j as t,W as u,K as p,X as g}from"./iframe-DLGvYYIN.js";import{r as h}from"./plugin-D2eFlVTw.js";import{S as l,u as c,a as x}from"./useSearchModal-lBGxdRqk.js";import{s as S,M}from"./api-BUgooSL5.js";import{S as C}from"./SearchContext-OW4vN2P3.js";import{B as m}from"./Button-Baz4R6OW.js";import{m as f}from"./makeStyles-DEKhmeuV.js";import{D as j,a as y,b as B}from"./DialogTitle-BHYVTWtf.js";import{B as D}from"./Box-Voe0tXZA.js";import{S as n}from"./Grid-DpqtaqiR.js";import{S as I}from"./SearchType-BO93-0mt.js";import{L as G}from"./List-CgTpYNOF.js";import{H as R}from"./DefaultResultListItem-Cm1ql_zV.js";import{w as k}from"./appWrappers-BLvGnBUx.js";import{SearchBar as v}from"./SearchBar-CmBnQFIJ.js";import{S as T}from"./SearchResult-Cg1Jh8Z_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B5efSvoQ.js";import"./Plugin-C2S2gGpi.js";import"./componentData-BbWMNPXa.js";import"./useAnalytics-0fvOd3T4.js";import"./useApp-lLuePZ3T.js";import"./useRouteRef-C6TYRW5x.js";import"./index-CzwyT08Z.js";import"./ArrowForward-B-7e9ItP.js";import"./translation-CY_nkbF4.js";import"./Page-C1P1AbQj.js";import"./useMediaQuery-BSUTARED.js";import"./Divider-DrWoyr0H.js";import"./ArrowBackIos-BZmfleeZ.js";import"./ArrowForwardIos-8W993LB3.js";import"./translation-B-cXZdKs.js";import"./lodash-C5x__jU_.js";import"./useAsync-CbA15NdN.js";import"./useMountedState-Cv7_7HCx.js";import"./Modal-VCWnU0_u.js";import"./Portal-BesUmCRU.js";import"./Backdrop-Dyjdn0Tl.js";import"./styled-B66Ywjg2.js";import"./ExpandMore-D2nnNZ12.js";import"./AccordionDetails-BVxqyaM9.js";import"./index-B9sM2jn7.js";import"./Collapse-85_XAqA3.js";import"./ListItem-BaUyqq3j.js";import"./ListContext-BtT7WJ3i.js";import"./ListItemIcon-CMaSX0Ij.js";import"./ListItemText-BKrHb2yE.js";import"./Tabs-B1BwFEp9.js";import"./KeyboardArrowRight-DW7yojHM.js";import"./FormLabel-BDeeaZd_.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cmz4PI9F.js";import"./InputLabel-CeUR67K8.js";import"./Select-CfqWY8gL.js";import"./Popover-DZWOjGlE.js";import"./MenuItem-BcpqiPrW.js";import"./Checkbox-Dz95yw7S.js";import"./SwitchBase-C46V7Fki.js";import"./Chip-DXCs3_Cx.js";import"./Link-DxwKZrYa.js";import"./index-Bh13v5tn.js";import"./useObservable-M3H9pj3U.js";import"./useIsomorphicLayoutEffect-B6Z-1KgF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CBbOE4WC.js";import"./useDebounce-DHXQTYym.js";import"./InputAdornment-AEPunAMG.js";import"./TextField-D3BQhCMi.js";import"./useElementFilter-W9KA_wCR.js";import"./EmptyState-Cvhffhq9.js";import"./Progress-BB59BTVB.js";import"./LinearProgress-uxbWUnaW.js";import"./ResponseErrorPanel-C6kNXrsL.js";import"./ErrorPanel-CCp-gDH1.js";import"./WarningPanel-DzCt2AAr.js";import"./MarkdownContent-TiUp9hsk.js";import"./CodeSnippet-DVSSjMBb.js";import"./CopyTextButton-C7sFvBkJ.js";import"./useCopyToClipboard-Steo6KBL.js";import"./Tooltip-Btq9c1g-.js";import"./Popper-DYpINPHQ.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
